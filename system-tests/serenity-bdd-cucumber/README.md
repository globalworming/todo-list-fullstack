# Getting started with Serenity and Cucumber

## The starter project
The best place to start with Serenity and Cucumber is to clone or download the starter project on Github ([https://github.com/serenity-bdd/serenity-cucumber-starter](https://github.com/serenity-bdd/serenity-cucumber-starter)). This project gives you a basic project setup, along with some sample tests and supporting classes.

## Run this project 
[![pipeline status](https://gitlab.com/globalworming/serenity-bdd-cucumber-petshop-api/badges/master/pipeline.svg)](https://gitlab.com/globalworming/serenity-bdd-cucumber-petshop-api/commits/master) [CI report](https://globalworming.gitlab.io/serenity-bdd-cucumber-petshop-api/index.html)

clone this project, run with `mvn verify` and then check out the [serenity report](./target/site/serenity/index.html). 

### It's failing
The test is failing, that is valid and reproducible when doing it via swagger-ui. Probably related to the server not actually storing images?

## add a test
* add a new scenario
* implement steps
