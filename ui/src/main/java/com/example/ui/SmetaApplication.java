package com.example.ui;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class SmetaApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmetaApplication.class, args);
		log.info("========== SMETA UI SERVER STARTED ==========");
	}

}
