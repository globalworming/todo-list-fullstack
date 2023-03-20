package com.headissue.test.domain;

import net.thucydides.core.environment.SystemEnvironmentVariables;
import net.thucydides.core.util.EnvironmentVariables;

public class Host {

    private static EnvironmentVariables environmentVariables;

    static {
        environmentVariables = SystemEnvironmentVariables.createEnvironmentVariables();
    }

    public static String getUrl() {
        if (environmentVariables.aValueIsDefinedFor("HOST")) {
            return environmentVariables.getProperty("HOST");
        }
        return "http://localhost:8080";
    }
}
