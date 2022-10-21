package com.plummers.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoadDatabase {
	private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);

	@Bean
	CommandLineRunner initDatabase(ClientRepository repository) {

		return args -> {
			log.info("Preloading " + repository.save(new Client("Bilbo Baggins", 2)));
			log.info("Preloading " + repository.save(new Client("Frodo Baggins", 1)));
			log.info("Preloading " + repository.save(new Client("Gandolf", 3)));
		};
	}
}
