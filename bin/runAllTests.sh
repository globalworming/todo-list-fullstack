set -xe

cd "$(dirname "$0")/.."

# pass results to bigquery
transmit=false

# process arguments
while getopts ":t" o; do
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

unit-tests() {
  (
    cd bff
    ./gradlew clean test
    java -jar "$report" build/test-results/test -u "$USER" -b "$branch" -l local -s bff -i isolated
  )
  (
    cd todo-service
    ./gradlew clean test
    java -jar "$report" build/test-results/test -u "$USER" -b "$branch" -l local -s todo-service -i isolated
  )
  (
    cd single-page-application
    rm junit.xml || true
    npm run test-ci
    java -jar "$report" . -u "$USER" -b "$branch" -l local -s single-page-application -i isolated
    rm cypress/TEST-*.xml || true
    npx cypress run --component --reporter junit --reporter-options "mochaFile=cypress/TEST-[hash].xml,toConsole=true,includePending=true,jenkinsMode=true"
    java -jar "$report" ./cypress -u "$USER" -b "$branch" -l local -s single-page-application -i isolated
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

system-tests() {
  (
    cd system-tests/postman
    npm run test
  )
  (
    cd system-tests/supertest
    npm run test-ci
  )
  (
    cd system-tests/serenity-bdd-screenplay-rest-assured
    ./gradlew clean test
    java -jar "$report" build/test-results/test -u "$USER" -b "$branch" -l local -s system -i integrated-mocked-3rd-party
  )
  (
    cd system-tests/serenity-bdd-cucumber
    ./mvnw clean verify
    java -jar "$report" target/failsafe-reports -u "$USER" -b "$branch" -l local -s system -i integrated-mocked-3rd-party
  )
}

if $transmit; then
  build-reporting-lib
fi

unit-tests
services-up
wait-for-services
system-tests
services-down
