package com.headissue.compliance.steps;

import com.headissue.compliance.Host;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.actions.Open;
import net.serenitybdd.screenplay.targets.Target;

import static net.serenitybdd.screenplay.EventualConsequence.eventually;
import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static org.hamcrest.core.StringContains.containsString;

public class ServerStatusStepDefinitions {

    @When("{actor} checks the server status")
    public void checkTheServerStatus(Actor actor) {
        actor.attemptsTo(Open.url(Host.getUrl()));
    }

    @Then("{actor} should see that the server {string} shows status {string}")
    public void seeThatTheServerShowsStatus(Actor actor, String server, String status) {
        actor.should(
                eventually(
                        seeThat("the status",
                                (a) -> Target
                                        .the("status")
                                        .locatedBy("body span[role=\"status\"]")
                                        .resolveFor(a)
                                        .getText(),
                                containsString("%s %s".formatted(server, status))))
                        .waitingForNoLongerThan(10).seconds());

    }

}
