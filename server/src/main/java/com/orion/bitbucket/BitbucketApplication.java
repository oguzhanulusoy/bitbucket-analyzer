package com.orion.bitbucket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication
@ComponentScan("com.orion.bitbucket.repository")
public class BitbucketApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(BitbucketApplication.class, args);

	}

	@Override
	public void run(String... args) throws Exception {

	}
}
