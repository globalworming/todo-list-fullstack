package com.headissue.compliance;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(ApplicationServerExtension.class)
class AuthTest {

  @Test
  void itShouldRedirectToGithub() {
    given()
        .when()
        .redirects()
        .follow(false)
        .get("http://localhost:8001/auth")
        .then()
        .header("Location", "https://github.com/auth");
  }

  @Test
  void itShouldDoMockRedirect() {
    given()
        .when()
        .redirects()
        .follow(false)
        .get("http://localhost:8001/auth?mockUserId=tammy")
        .then()
        .header("Location", "http://localhost:3000/?code=tammy_code");
  }

  @Test
  void itShouldDoMockCodeExchange() {
    given()
        .contentType(ContentType.JSON)
        .body("{\"accessCode\": \"tammy_code\"}")
        .when()
        .post("http://localhost:8001/auth")
        .then()
        .body("accessToken", equalTo("tammy_token"));
  }

  @Test
  void itShouldReturnMockUserData() {
    given()
        .contentType(ContentType.JSON)
        .header("Authorization", "Bearer tammy_token")
        .when()
        .get("http://localhost:8001/me")
        .then()
        .body("name", equalTo("tammy"))
        .body("id", equalTo("tammy_id"));
  }
}
