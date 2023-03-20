#!/bin/bash

set -x

cd "$(dirname "$0")/.."

stage="local"
# pass results to bigquery
transmit=false

# process arguments
while getopts "ts:" o; do
  # FIXME add parameter to run all (?) tests against production
  case "${o}" in
  t)
    transmit=true
    ;;
  s)
    stage=$OPTARG
    ;;
  *)
    echo "Usage: bash runAllTests.sh [-t] [-s \"\$stage\"]"
    ;;
  esac
done
# In the context of processing command-line arguments with getopts, shift $((OPTIND-1)) is used to remove all the processed options and their corresponding arguments from the positional parameters.
shift $((OPTIND - 1))

build-reporting-lib() {
  (
    cd report
    ./gradlew clean shadowJAR
  )
}

report-results() {
  if $transmit; then
    java -jar "$report" -u "$USER" -b "$branch" "$@"
  fi
}

unit-tests() {
  (
    cd bff
    ./gradlew clean test
    report-results build/test-results/test -l local -s bff -i isolated --src bff-unit-tests
  )
  (
    cd todo-service
    ./gradlew clean test
    report-results build/test-results/test -l local -s todo-service -i isolated --src todo-service-unit-tests
  )
  (
    cd single-page-application
    rm junit.xml || true
    npm run test-ci
    report-results . -l local -s single-page-application -i isolated --src single-page-application-component-tests
    rm cypress/TEST-*.xml || true
    npx cypress run --component --reporter junit --reporter-options "mochaFile=cypress/TEST-[hash].xml,toConsole=true,includePending=true,jenkinsMode=true"
    report-results ./cypress -l local -s single-page-application -i isolated --src single-page-application-cypress-component-tests
  )
}

services-up() {
  docker compose -f docker-compose.local.yml up -d --build
}

services-down() {
  docker compose -f docker-compose.local.yml down
}

wait-for-services() {
  ./bin/wait-for-it.sh localhost:3000
  ./bin/wait-for-it.sh localhost:8080
}

supertest() {
  (
    cd system-tests/supertest
    if test "$stage" = "local"; then
      npm run test-local
    fi
    if test "$stage" = "prod"; then
      npm run test-prod
    fi

    report-results . -l "$stage" -s system -i integrated-mocked-3rd-party --src supertest-tests
  )
}

postman() {
  (
    cd system-tests/postman
    rm newman/*.xml || true

    if test "$stage" = "local"; then
      npm run test
    fi
    if test "$stage" = "prod"; then
      npm run test-prod
    fi

    report-results ./newman -l "$stage" -s system -i integrated-mocked-3rd-party --src postman-collection
  )
}

serenity-rest-assured() {
  (
    cd system-tests/serenity-bdd-screenplay-rest-assured

    if test "$stage" = "local"; then
      ./gradlew clean test -DHOST=http://localhost:8080
    fi
    if test "$stage" = "prod"; then
      ./gradlew clean test -DHOST=https://bff-fg5blhx72q-ey.a.run.app/health
    fi

    report-results build/test-results/test -l "$stage" -s system -i integrated-mocked-3rd-party --src serenity-rest-assured-tests
  )
}

serenity-cucumber-browser() {
  (
    cd system-tests/serenity-bdd-cucumber
    if test "$stage" = "local"; then
    ./mvnw clean verify -DHOST=http://localhost:3000
    fi
    if test "$stage" = "prod"; then
      ./mvnw clean verify -DHOST=https://single-page-application-fg5blhx72q-ey.a.run.app/
    fi
    report-results target/failsafe-reports -l "$stage" -s system -i integrated-mocked-3rd-party --src serenity-cucumber-browser-tests
  )
}

system-tests() {
  postman
  supertest
  serenity-rest-assured
  serenity-cucumber-browser
}

if $transmit; then
  build-reporting-lib
  echo "results will be pushed to BigQuery"
  export report="$(realpath "report/build/libs/report-1.0-SNAPSHOT-all.jar")"
  export branch="$(git branch --show-current)"
fi

if test "$stage" = "local"; then
  unit-tests
  services-up
  wait-for-services
  system-tests
  services-down
elif test "$stage" = "prod"; then
  system-tests
else
  echo "unsupported stage: $stage"
  exit 1
fi
