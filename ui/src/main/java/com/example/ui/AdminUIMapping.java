package com.example.ui;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.stream.Stream;

@Configuration
public class AdminUIMapping implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        Stream.of("index", "hello", "smeta", "smetaOld"
        ).forEach(path -> registry.addViewController("/" + path).setViewName(path));
    }
}

