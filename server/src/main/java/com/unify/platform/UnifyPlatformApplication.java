package com.unify.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.unify.platform")
public class UnifyPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(UnifyPlatformApplication.class, args);
    }
}
