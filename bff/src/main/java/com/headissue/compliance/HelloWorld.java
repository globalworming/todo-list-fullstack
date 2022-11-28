package com.headissue.compliance;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class HelloWorld extends HttpServlet {

    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws
            IOException {

        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().println("Hello World!");
    }
}