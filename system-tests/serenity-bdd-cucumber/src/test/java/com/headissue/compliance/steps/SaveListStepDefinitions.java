package com.headissue.compliance.steps;

import com.headissue.compliance.Host;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.actions.Open;

public class SaveListStepDefinitions {

    @When("{actor} saves an empty todo list")
    public void saveAnEmptyTodoList(Actor actor) {
        actor.attemptsTo(Open.url(Host.getUrl()));
        // TODO give the list a name
        // TODO save
    }

    @Then("{actor} should see the error message {string}")
    public void shouldSeeTheErrorMessage(Actor actor, String message) {
        // TODO actor.should(seeThat(....
    }
}
