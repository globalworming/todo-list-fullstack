package com.headissue.compliance.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.headissue.compliance.todo.v1.Auth;
import com.headissue.compliance.todo.v1.AuthServiceGrpc;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;

public class MeServlet extends HttpServlet {

  private final Gson gson = new Gson();
  private final AuthServiceGrpc.AuthServiceBlockingStub authService;

  public MeServlet(AuthServiceGrpc.AuthServiceBlockingStub authService) {

    this.authService = authService;
  }

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    String authorization = req.getHeader("Authorization");
    if (authorization != null && authorization.startsWith("Bearer ")) {
      if (isMagicBearer(authorization)) {
        PrintWriter out = resp.getWriter();
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        JsonObject user = new JsonObject();
        user.addProperty("name", "tammy");
        user.addProperty("id", "tammy_id");
        out.print(user);
        out.flush();
      }

      throw new RuntimeException("ToDo");
    }
  }

  private boolean isMagicBearer(String authorization) {
    return authorization.equals("Bearer tammy_token");
  }
}
