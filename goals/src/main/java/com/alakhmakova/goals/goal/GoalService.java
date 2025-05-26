package com.alakhmakova.goals.goal;
import org.springframework.stereotype.Service;
import java.util.Collections;
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

    public Goal save(Goal goal) {
        return goalRepository.save(goal);
    }
    public Goal saveGoal(String text, String description, String date, String sharedWithEmail) {
        Goal goal = new Goal();
        goal.setType("goal");
        goal.setText(text);
        goal.setDescription(description);
        goal.setDate(date);
        goal.setProgressTarget(0);
        goal.setButton("0 targets");
        goal.setInFolder("");
        goal.setOwner("");
        if (sharedWithEmail != null && !sharedWithEmail.isEmpty()) {
            goal.setSharedWith(Collections.singletonList(sharedWithEmail));
        }
        return goalRepository.save(goal);
    }

    public Goal getGoalById(String id) {
        return goalRepository.findById(id).orElse(null);
    }

}
