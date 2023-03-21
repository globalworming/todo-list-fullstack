#!/bin/bash

set -x

cd "$(dirname "$0")/.."
root=$(pwd)
out=$(realpath out/"$(date "+%Y%m%d-%H%M%S")"-runAllTests.log)
report=$root/report/build/libs/report-1.0-SNAPSHOT-all.jar
branch="$(git branch --show-current)"

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
  if ! test -f "$report"; then
    (
      cd report
      ./gradlew clean shadowJAR
    )
  fi
}

report-results() {
  java -jar "$report" -u "$USER" -b "$branch" -t $transmit "$@"
}

tee-to-out() {
  tee -a $out
}

unit-tests() {
  (
    cd bff
    ./gradlew clean test | tee-to-out
    report-results build/test-results/test -l local -s bff -i isolated --src bff-unit-tests | tee-to-out
  )
  (
    cd todo-service
    ./gradlew clean test | tee-to-out
    report-results build/test-results/test -l local -s todo-service -i isolated --src todo-service-unit-tests | tee-to-out
  )
  (
    cd single-page-application
    rm junit.xml || true
    npm run test-ci | tee-to-out
    report-results . -l local -s single-page-application -i isolated --src single-page-application-component-tests | tee-to-out
    rm cypress/TEST-*.xml || true
    npx cypress run --component --reporter junit --reporter-options "mochaFile=cypress/TEST-[hash].xml,toConsole=true,includePending=true,jenkinsMode=true" | tee-to-out
    report-results ./cypress -l local -s single-page-application -i isolated --src single-page-application-cypress-component-tests | tee-to-out
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


build-reporting-lib

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

RED='\033[0;31m'
cat "$out" | grep "TestResult" | grep -vE "success|skipped" | xargs echo -e $RED