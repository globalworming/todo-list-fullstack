Feature: Authorization with Github Oauth

  Background: People are worried their data is accessible by others

  Scenario:
    Given Olivian has no authorization
    When Olivian try to save a list
    Then Olivian can not do that

  Scenario:
    Given Olivian has no authorization
    When Olivian authorize the app to use github access
    And Olivian try to save a list
    Then Olivian should see the list is saved

# FIXME more scenarios we can do
  # one person can't access anothers
  # logging out?
  #

