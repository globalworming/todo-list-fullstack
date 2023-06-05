package com.headissue.compliance.steps;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;

import com.headissue.compliance.Host;
import com.headissue.compliance.actor.Memory;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import java.util.Arrays;
import java.util.List;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.actions.Open;
import org.apache.commons.lang3.NotImplementedException;
import org.hamcrest.CoreMatchers;

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

  @When("{actor} try to save a list")
  public void theyTryToSaveAList(Actor actor) {
    actor.attemptsTo(CreateTodoList.named("my todo list").withItems("feed dog", "feed whale"));
    actor.attemptsTo(new SaveList());
    actor.remember(Memory.SAVE_LIST_WAS_SUCCESSFUL.name(), false);
  }

  @Then("{actor} can not do that")
  public void theyCanNotDoThat(Actor actor) {
    actor.should(
        seeThat((a) -> a.recall(Memory.SAVE_LIST_WAS_SUCCESSFUL.name()), CoreMatchers.is(true)));
  }

  @Then("{actor} should see the list is saved")
  public void theyShouldSeeTheListIsSaved(Actor actor) {

  }

  private static class CreateTodoList implements Performable {
    private final String name;
    private final List<String> toDos;

    private CreateTodoList(String name, List<String> toDos) {
      this.name = name;
      this.toDos = toDos;
    }

    public static CreateTodoList named(String name) {
      return new CreateTodoList(name, null);
    }

    public CreateTodoList withItems(String... items) {
      return new CreateTodoList(name, Arrays.stream(items).toList());
    }

    @Override
    public void performAs(Actor a) {
      throw new NotImplementedException("TODO");
    }
  }

  private static class SaveList implements Performable {
    @Override
    public <T extends Actor> void performAs(T t) {
      throw new NotImplementedException("TODO");
    }
  }
}
