package com.headissue.compliance;

import jakarta.servlet.*;

import java.util.EnumSet;
import java.util.Set;

public class LoggingContextInitializer implements ServletContainerInitializer {

    @Override
    public void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException {
        FilterRegistration.Dynamic registration = ctx.addFilter("RequestContextFilter", RequestContextFilter.class);
        registration.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), false, "/*");
        registration.setAsyncSupported(true);
    }


}

