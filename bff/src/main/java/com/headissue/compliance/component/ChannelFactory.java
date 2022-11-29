package com.headissue.compliance.component;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

public class ChannelFactory {
    public static ManagedChannel buildChannel(String env, String defaultHost) {
        String host = System.getenv(env);
        if (host == null) {
            host = defaultHost;
        } else {
            host = host.replace("https://", "");
        }
        if (host.startsWith("localhost")) {
            return plainTextChannel(host).build();
        } else {
            return tlsChannel(host).build();
        }
    }

    private static ManagedChannelBuilder<?> tlsChannel(String todoServiceHost1) {
        return ManagedChannelBuilder.forTarget(todoServiceHost1 + ":443")
                .useTransportSecurity();
    }

    private static ManagedChannelBuilder<?> plainTextChannel(String todoServiceHost1) {
        if (!todoServiceHost1.contains(":")) {
            throw new RuntimeException("bad target format");
        }
        String hostName = todoServiceHost1.split(":")[0];
        String port = todoServiceHost1.split(":")[1];
        return ManagedChannelBuilder.forAddress(hostName, Integer.parseInt(port)).usePlaintext();
    }
}
