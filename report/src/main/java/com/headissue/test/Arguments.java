package com.headissue.test;

import java.io.File;

public record Arguments(
        String branch,
        String user,
        String system,
        String location,
        String isolation,
        File dir,
        String source) {
}
