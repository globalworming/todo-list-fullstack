#!/bin/bash

set -x

cd "$(dirname "$0")/.."

# pass results to bigquery
transmit=false

# process arguments
while getopts ":t" o; do
  # FIXME add parameter to run all (?) tests against production
  case "${o}" in
  t)
    transmit=true
    ;;
  *)
    usage
    ;;
  esac
done
# In the context of processing command-line arguments with getopts, shift $((OPTIND-1)) is used to remove all the processed options and their corresponding arguments from the positional parameters.
shift $((OPTIND - 1))

if $transmit; then
  echo "results will be pushed to BigQuery"
  export report="$(realpath "report/build/libs/report-1.0-SNAPSHOT-all.jar")"
  export branch="$(git branch --show-current)"

fi

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
    npm run test-ci
    report-results . -l local -s system -i integrated-mocked-3rd-party --src supertest-tests
  )
}

postman() {
  (
    cd system-tests/postman
    rm newman/*.xml || true
    npm run test
    report-results ./newman -l local -s system -i integrated-mocked-3rd-party --src postman-collection
  )
}

serenity-rest-assured() {
  (
    cd system-tests/serenity-bdd-screenplay-rest-assured
    ./gradlew clean test
    report-results build/test-results/test -l local -s system -i integrated-mocked-3rd-party --src serenity-rest-assured-tests
  )
}

serenity-cucumber-browser() {
  (
    cd system-tests/serenity-bdd-cucumber
    ./mvnw clean verify
    report-results target/failsafe-reports -l local -s system -i integrated-mocked-3rd-party --src serenity-cucumber-browser-tests
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
fi

unit-tests
services-up
wait-for-services
system-tests
services-down