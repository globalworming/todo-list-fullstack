package com.headissue.compliance.servlet;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import static jakarta.servlet.http.HttpServletResponse.SC_INTERNAL_SERVER_ERROR;

public class OpenApiSchema extends HttpServlet {

    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws
            IOException {
        response.setContentType("text/plain");

        try(InputStream in = this.getClass().getResourceAsStream("/openapi.yaml");
            OutputStream out = response.getOutputStream()) {
            if (in == null) {
                response.setStatus(SC_INTERNAL_SERVER_ERROR);
                return;
            }

            response.setHeader("Content-disposition", "attachment; filename=openapi.yaml");

            int ARBITARY_SIZE = 1048;
            byte[] buffer = new byte[ARBITARY_SIZE];

            int numBytesRead;
            while ((numBytesRead = in.read(buffer)) > 0) {
                out.write(buffer, 0, numBytesRead);
            }
        }
    }
}