Feature: Saveing a Todo List

  Background: Saving a Todo List...

  Scenario Outline:
    When Olivian saves an empty todo list
    Then Olivian should see the error message "<message>"

    Examples:
      | message |
      | list s empty    |

