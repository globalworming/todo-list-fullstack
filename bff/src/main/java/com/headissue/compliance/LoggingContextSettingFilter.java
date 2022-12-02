package com.headissue.compliance;

import com.google.cloud.logging.Context;
import com.google.cloud.logging.ContextHandler;
import com.google.cloud.logging.HttpRequest;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class LoggingContextSettingFilter extends HttpFilter {

    @Override
    protected void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {

        ContextHandler ctxHandler = new ContextHandler();
        Context.Builder ctx = Context.newBuilder()
                .setRequestUrl(req.getRequestURI())
                .setRequestMethod(HttpRequest.RequestMethod.valueOf(req.getMethod()));
        String trace = req.getHeader("X-Cloud-Trace-Context");
        if (trace != null) {
            ctx.setTraceId(trace);
        }
        ctxHandler.setCurrentContext(ctx.build());


        // pass the request along the filter chain
        super.doFilter(req, res, chain);
    }
}