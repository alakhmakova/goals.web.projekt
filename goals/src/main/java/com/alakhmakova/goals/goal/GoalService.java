package com.alakhmakova.goals.goal;
import com.alakhmakova.goals.target.Target;
import com.alakhmakova.goals.target.TargetRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalService {
    //field marked as final, indicating that it cannot be subsequently changed
    private final GoalRepository goalRepository;
    private final TargetRepository targetRepository;

    //Dependency is injected through the constructor
    public GoalService(GoalRepository goalRepository, TargetRepository targetRepository) {
        this.goalRepository = goalRepository;
        this.targetRepository = targetRepository;
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

    public Goal addTarget(String goalId, Target target) {
        Goal goal = goalRepository.findById(goalId).orElse(null);
        if (goal == null) {
            throw new IllegalArgumentException("Goal with ID " + goalId + " not found");
        }
        if (goal.getTargets() == null) {
            goal.setTargets(new ArrayList<>());
        }
        goal.getTargets().add(target.getTargetID());
        return goalRepository.save(goal);
    }

    public List<Target> getAllTargetsByGoalID() {
        List<Goal> goals = goalRepository.findAll();
        // Assuming you have a method to fetch Target by ID
        return goals.stream()
                .flatMap(goal -> goal.getTargets().stream())
                .map(targetRepository::findByTargetID)
                .collect(Collectors.toList());
    }
}
