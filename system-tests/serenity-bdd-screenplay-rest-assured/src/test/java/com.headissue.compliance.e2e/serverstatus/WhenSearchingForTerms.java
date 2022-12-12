package com.headissue.compliance.e2e.serverstatus;

import net.serenitybdd.junit5.SerenityJUnit5Extension;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.actors.Cast;
import net.serenitybdd.screenplay.rest.abilities.CallAnApi;
import net.serenitybdd.screenplay.rest.interactions.Get;
import org.hamcrest.CoreMatchers;
import org.hamcrest.collection.IsIterableContainingInOrder;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static net.serenitybdd.screenplay.rest.questions.ResponseConsequence.seeThatResponse;

@ExtendWith(SerenityJUnit5Extension.class)
class WhenCheckingServerStatus {

    Cast cast = Cast.whereEveryoneCan(CallAnApi.at("https://bff-fg5blhx72q-ey.a.run.app"));

    @Test
    void whereAllIsOK() {
        Actor actor = cast.actorNamed("Olivian");
        actor.attemptsTo(new Get("/health"));
        actor.should(seeThatResponse("all services report healthy status", response -> response
                .statusCode(200)
                .body("services.size()", CoreMatchers.is(2))
                .body("services.serving.asList()", IsIterableContainingInOrder.contains(true, true))
                .body("services.name.asList()", IsIterableContainingInOrder.contains("bff", "todo"))
        ));
    }
}
