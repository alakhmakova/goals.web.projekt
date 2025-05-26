package com.alakhmakova.goals.goal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController//use with a REST API
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

}
