package com.headissue.compliance.steps;

import com.headissue.compliance.Host;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Open;
import net.serenitybdd.screenplay.targets.Target;
import org.apache.commons.lang3.NotImplementedException;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;

public class AuthStepsDefinitions {

  @Given("{actor} has no authorization")
  public void olivianHasNoAuthorization(Actor actor) {
    actor.attemptsTo(Open.url(Host.getUrl()));
    actor.should(seeThat(new TheyAreNotLoggedIn()));
  }

  @When("{actor} authorize the app to use github access")
  public void theyAuthorizeTheAppToUseGithubAccess(Actor actor) {
    actor.attemptsTo(new AuthorizeGithubAccess());
  }

  private static class TheyAreNotLoggedIn implements Question<Boolean> {
    @Override
    public Boolean answeredBy(Actor actor) {
      return Target.the("logged in element")
          .locatedBy(".shows-authentication .shows-logged-in")
          .resolveFor(actor)
          .isPresent();
    }
  }

  private static class AuthorizeGithubAccess implements Performable {
    @Override
    public void performAs(Actor a) {
      a.attemptsTo(Click.on(".login-with-github"));
      a.attemptsTo(new LoginToGithub());
      a.attemptsTo(Click.on(".confirm"));
    }
  }

  private static class LoginToGithub implements Performable {
    @Override
    public <T extends Actor> void performAs(T t) {
      throw new NotImplementedException("Todo");
    }
  }
}
