set -xe

cd "$(dirname "$0")/.."

unit-tests() {
  (
    cd bff
    ./gradlew test
  )
  (
    cd todo-service
    ./gradlew test
  )
  (
    cd single-page-application
    npm run test-ci
    npx cypress run --component
  )
}

services-up() {
  docker compose -f docker-compose.local.yml up -d --build
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
    ./gradlew test
  )
  (
    cd system-tests/serenity-bdd-cucumber
    ./gradlew test
  )
}

unit-tests
services-up
wait-for-services
system-tests
