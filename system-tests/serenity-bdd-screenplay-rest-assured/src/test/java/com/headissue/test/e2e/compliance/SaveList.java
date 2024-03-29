package com.headissue.test.e2e.compliance;

import com.headissue.test.domain.Host;
import net.serenitybdd.junit5.SerenityJUnit5Extension;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.actors.Cast;
import net.serenitybdd.screenplay.rest.abilities.CallAnApi;
import net.serenitybdd.screenplay.rest.interactions.Post;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.UUID;

import static net.serenitybdd.screenplay.rest.questions.ResponseConsequence.seeThatResponse;

@ExtendWith(SerenityJUnit5Extension.class)
class SaveList {

    Cast cast = Cast.whereEveryoneCan(CallAnApi.at(Host.getUrl()));

    @Test
    void whereListIsEmpty() {
        Actor actor = cast.actorNamed("Olivian");
        actor.attemptsTo(new Post("/toDoLists")
                .with(request -> request.header("Content-Type", "application/json")
                        .body("{name: 'some list', toDos: []}")
                ));
        actor.should(seeThatResponse("bad request", response -> response
                .statusCode(400)
                .body("errors[0].error", CoreMatchers.is("is empty"))
                .body("errors[0].path", CoreMatchers.is("$.toDos"))
        ));
    }

    @Test
    void whereListIsSavedSuccessfully() {
        Actor actor = cast.actorNamed("Olivian");
        actor.attemptsTo(new Post("/toDoLists")
                .with(request -> request.header("Content-Type", "application/json")
                        .body("{name: 'some list " + UUID.randomUUID() + "', toDos: [{description: 'feed the cat'}]}")
                ));
        actor.should(seeThatResponse("bad request", response -> response
                .statusCode(200)
        ));
    }

    /*
    scenario: where list name is already present
    * given list with NAME was saved in the past
    * save list
    * see message "name already taken"
    */

    @Test
    void whereListWithNameAlreadyExists() {

    }
}
