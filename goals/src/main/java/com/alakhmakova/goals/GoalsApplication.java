package com.alakhmakova.goals;

import com.alakhmakova.goals.folder.FolderRepository;
import com.alakhmakova.goals.goal.Goal;
import com.alakhmakova.goals.goal.GoalRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;

@SpringBootApplication
public class GoalsApplication {

    public static void main(String[] args) {

        SpringApplication.run(GoalsApplication.class, args);
    }

    /*@Bean
    public CommandLineRunner run(FolderRepository folderRepository, GoalRepository goalRepository) {
        return args -> {
            //folderRepository.findAll().forEach(System.out::println);
            goalRepository.findAll().forEach(System.out::println);
            System.out.println(goalRepository.findByText("Read one tech article"));
        };
    }*/
}
