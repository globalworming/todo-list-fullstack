package com.headissue.test;

import com.google.cloud.Timestamp;

public record TestResult(
        String capability,
        String feature,
        String scenario,
        String status,
        String user,
        String branch,
        String result,
        Timestamp timestamp,
        String system,
        String location,
        String isolation,
        String source) {
}
