package com.alakhmakova.goals.goal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
public class GoalController {
    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public List<Goal> showGoals() {
        List<Goal> goals = goalService.getAllGoalsWithoutFolders();
        return goals;
    }

    @PostMapping
    public Goal createGoal(@RequestBody Goal goal) {
        return goalService.save(goal);
    }

}
