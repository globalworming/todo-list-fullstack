package com.headissue.compliance;

import com.google.cloud.logging.Context;
import com.google.cloud.logging.ContextHandler;
import com.google.cloud.logging.HttpRequest;
import com.google.common.base.Strings;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class RequestContextFilter extends HttpFilter {
    private static final long serialVersionUID = 1517497440413815384L;
    private static final String CLOUD_TRACE_CONTEXT_HEADER = "x-cloud-trace-context";
    private static final String W3C_TRACEPARENT_HEADER = "traceparent";

    private final ContextHandler contextHandler = new ContextHandler();

    @Override
    protected void doFilter(HttpServletRequest req, HttpServletResponse resp, FilterChain chain)
            throws IOException, ServletException {
        Context oldContext = contextHandler.getCurrentContext();
        try {
            HttpRequest logHttpRequest = generateLogEntryHttpRequest(req, resp);
            Context.Builder builder = Context.newBuilder().setRequest(logHttpRequest);
            String tracingHeader = req.getHeader(W3C_TRACEPARENT_HEADER);
            if (tracingHeader != null) {
                builder.loadW3CTraceParentContext(tracingHeader);
            } else {
                builder.loadCloudTraceContext(req.getHeader(CLOUD_TRACE_CONTEXT_HEADER));
            }
            contextHandler.setCurrentContext(builder.build());
            super.doFilter(req, resp, chain);
        } finally {
            contextHandler.setCurrentContext(oldContext);
        }
    }

    private static HttpRequest generateLogEntryHttpRequest(
            HttpServletRequest req, HttpServletResponse resp) {
        if (req == null) {
            return null;
        }
        HttpRequest.Builder builder = HttpRequest.newBuilder();
        builder
                .setReferer(req.getHeader("referer"))
                .setRemoteIp(req.getRemoteAddr())
                .setRequestMethod(HttpRequest.RequestMethod.valueOf(req.getMethod()))
                .setRequestSize(req.getContentLengthLong())
                .setRequestUrl(composeFullUrl(req))
                .setServerIp(req.getLocalAddr())
                .setUserAgent(req.getHeader("user-agent"));
        if (resp != null) {
            builder.setStatus(resp.getStatus()).setResponseSize(resp.getBufferSize());
        }
        return builder.build();
    }

    private static String composeFullUrl(HttpServletRequest req) {
        String query = req.getQueryString();
        if (Strings.isNullOrEmpty(query)) {
            return req.getRequestURL().toString();
        }
        return req.getRequestURL().append("?").append(query).toString();
    }
}
