Feature: Server Status

  Background: Multiple roles benefit from knowing if the app is connected to online services and if these services are healthy

  Scenario Outline:  Olivian would like to get confidence the online features can be used without issue
    When Olivian checks the server status
    Then Olivian should see that the server "<server>" shows status "<status>"

    Examples:
      | server | status |
      | bff    | ok     |
      | todo   | ok     |

