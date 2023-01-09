package com.headissue.compliance.e2e.saveList;

import net.serenitybdd.junit5.SerenityJUnit5Extension;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.actors.Cast;
import net.serenitybdd.screenplay.rest.abilities.CallAnApi;
import net.serenitybdd.screenplay.rest.interactions.Get;
import net.serenitybdd.screenplay.rest.interactions.Post;
import org.hamcrest.CoreMatchers;
import org.hamcrest.collection.IsIterableContainingInOrder;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static net.serenitybdd.screenplay.rest.questions.ResponseConsequence.seeThatResponse;

@ExtendWith(SerenityJUnit5Extension.class)
class WhenSavingToDoList {

    Cast cast = Cast.whereEveryoneCan(CallAnApi.at("https://bff-fg5blhx72q-ey.a.run.app"));

    @Test
    void whereListIsEmpty() {
        Actor actor = cast.actorNamed("Olivian");
        actor.attemptsTo(new Post("/toDoLists")
                .with(request -> request.header("Content-Type", "application/json")
                .body("{name: 'some list', todoItem: []}")
        ));
        actor.should(seeThatResponse("bad request", response -> response
                .statusCode(400)
                .body("error", CoreMatchers.is("EMPTY_LIST"))
        ));
    }

    @Test
    void whereListIsSavedSuccessfully() {
        Actor actor = cast.actorNamed("Olivian");
        actor.attemptsTo(new Post("/toDoLists")
                .with(request -> request.header("Content-Type", "application/json")
                .body("{name: 'some list', todoItem: [{description: 'feed the cat'}]}")
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
