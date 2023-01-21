package com.headissue.compliance.error;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.http.entity.ContentType;
import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.handler.ErrorHandler;

import java.io.IOException;
import java.io.PrintWriter;

public class MyErrorHandler extends ErrorHandler {
    public void handle(String target,
                       Request baseRequest,
                       HttpServletRequest request,
                       HttpServletResponse response) throws IOException {
        Throwable cause = (Throwable) request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);
        response.setContentType(ContentType.APPLICATION_JSON.getMimeType());
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        JsonObject errorObject = new JsonObject();
        errorObject.addProperty("type", cause.getClass().getSimpleName());
        errorObject.addProperty("message", cause.getMessage());
        if (cause instanceof ValidationException) {
            JsonArray fieldErrors = new JsonArray();
            JsonObject fieldError = new JsonObject();
            fieldError.addProperty("error", ((ValidationException) cause).getFieldError());
            fieldError.addProperty("path", ((ValidationException) cause).getPath());
            fieldErrors.add(fieldError);
            errorObject.add("errors", fieldErrors);
        }

        try (PrintWriter writer = response.getWriter()) {
            writer.write(errorObject.toString());
        }
    }

}
