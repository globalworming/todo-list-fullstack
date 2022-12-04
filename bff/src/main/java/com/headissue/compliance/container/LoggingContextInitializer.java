package com.headissue.compliance.container;

import com.headissue.compliance.filter.RequestContextFilter;
import jakarta.servlet.*;

import java.util.EnumSet;
import java.util.Set;

public class LoggingContextInitializer implements ServletContainerInitializer {

    @Override
    public void onStartup(Set<Class<?>> c, ServletContext ctx) {
        FilterRegistration.Dynamic registration = ctx.addFilter("RequestContextFilter", RequestContextFilter.class);
        registration.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), false, "/*");
        registration.setAsyncSupported(true);
    }


}

