package com.alakhmakova.goals.goal;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller //use with Thymeleaf
public class GoalTemplateController {
    private final GoalService goalService;

    public GoalTemplateController(GoalService goalService) {
        this.goalService = goalService;
    }
    @PostMapping("/goal")
    public String createGoal(
            @RequestParam("text") String text,
            @RequestParam("description") String description,
            @RequestParam("date") String date,
            @RequestParam(value = "sharedWith", required = false) String sharedWith,
            Model model) {
        Goal savedGoal = goalService.saveGoal(text, description, date, sharedWith);
        model.addAttribute("goal", savedGoal);
        return "goal";
    }
}
