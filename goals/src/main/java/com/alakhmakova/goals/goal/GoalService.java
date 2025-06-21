package com.alakhmakova.goals.goal;
import com.alakhmakova.goals.target.Target;
import com.alakhmakova.goals.target.TargetRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.stereotype.Service;

import java.util.*;

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

    public Goal updateSome(String goalId,
                             @NotBlank String text,
                             Optional<String> date,
                             Optional<String> description,
                             Optional<String> inFolder,
                             Optional<List<String>> sharedWith,
                             Optional<List<String>> targets) throws NoSuchElementException {
        Goal goal = verifyGoal(goalId);
        date.ifPresent(goal::setDate);
        description.ifPresent(goal::setDescription);
        inFolder.ifPresent(goal::setInFolder);
        sharedWith.ifPresent(goal::setSharedWith);
        targets.ifPresent(goal::setTargets);
        return goalRepository.save(goal);
    }
    private Goal verifyGoal(String goalId) throws NoSuchElementException {
        return goalRepository.findById(goalId)
                .orElseThrow(() -> new NoSuchElementException("Goal does not exist " + goalId));
    }
}
