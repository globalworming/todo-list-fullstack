package com.headissue.compliance.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.headissue.compliance.todo.v1.Auth;
import com.headissue.compliance.todo.v1.AuthServiceGrpc;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

public class AuthServlet extends HttpServlet {

  private final Gson gson = new Gson();
  private final AuthServiceGrpc.AuthServiceBlockingStub authService;

  public AuthServlet(AuthServiceGrpc.AuthServiceBlockingStub authService) {

    this.authService = authService;
  }

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {

    String mockUserId = req.getParameter("mockUserId");
    if (mockUserId == null) {
      resp.sendRedirect("https://github.com/auth");
      return;
    }
    resp.sendRedirect("http://localhost:3000/?code=" + mockUserId + "_code");
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    BufferedReader reader = req.getReader();
    JsonObject body = gson.fromJson(reader, JsonObject.class);
    String accessCode = body.get("accessCode").getAsString();
    if (isMagicAccessCode(accessCode)) {
      PrintWriter out = resp.getWriter();
      resp.setContentType("application/json");
      resp.setCharacterEncoding("UTF-8");
      out.print("{\"accessToken\": \"" + accessCode.split("_")[0] + "_token\"}");
      out.flush();
      return;
    }
    String accessToken =
        authService
            .exchangeCodeForToken(
                Auth.ExchangeCodeForTokenParameter.newBuilder().setCode(accessCode).build())
            .getAccessCode();
  }

  private boolean isMagicAccessCode(String accessCode) {
    return accessCode.endsWith("_code");
  }
}
