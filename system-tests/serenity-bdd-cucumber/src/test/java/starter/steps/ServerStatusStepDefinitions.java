package starter.steps;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.actions.Open;
import net.serenitybdd.screenplay.targets.Target;
import org.hamcrest.core.StringContains;

import static net.serenitybdd.screenplay.EventualConsequence.eventually;
import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static org.hamcrest.core.StringContains.containsString;

public class ServerStatusStepDefinitions {

    @When("{actor} checks the server status")
    public void checkTheServerStatus(Actor actor) {
        actor.attemptsTo(Open.url("https://single-page-application-fg5blhx72q-ey.a.run.app"));
    }

    @Then("{actor} should see that the server {string} shows status {string}")
    public void olivianShouldSeeThatTheServerServerShowsStatusStatus(Actor actor, String server, String status) {
        actor.should(eventually(seeThat("the status", (a) -> Target.the("status").locatedBy("body span[role=\"status\"]").resolveFor(a).getText(), containsString("%s %s".formatted(server, status)))));

    }

}
