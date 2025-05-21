package com.alakhmakova.goals.goal;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalService {
    //field marked as final, indicating that it cannot be subsequently changed
    private final GoalRepository goalRepository;

    //Dependency is injected through the constructor
    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    public List<Goal> getAllGoalsWithoutFolders() {
        return goalRepository.findByInFolder("");
    }
}
