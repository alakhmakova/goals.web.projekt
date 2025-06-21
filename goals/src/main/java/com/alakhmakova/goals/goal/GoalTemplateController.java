package com.alakhmakova.goals.goal;
import com.alakhmakova.goals.target.Target;
import com.alakhmakova.goals.target.TargetService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Controller //use with Thymeleaf
public class GoalTemplateController {
    private static final Logger log = LogManager.getLogger(GoalTemplateController.class);

    private final GoalService goalService;
    public final TargetService targetService;

    public GoalTemplateController(GoalService goalService, TargetService targetService) {
        this.goalService = goalService;
        this.targetService = targetService;
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
        return "redirect:/goal/" + savedGoal.getId();
    }

    @GetMapping("/goal/{id}")
    public String getGoalById(@PathVariable String id, Model model) {
        Goal goal = goalService.getGoalById(id);
        model.addAttribute("goal", goal);//Goal object is added to the model
        List<Target> targets = targetService.getAllTargetsByGoalID(id);
        log.info("Targets inside the goal: " + targets);
        model.addAttribute("targets", targets);// List of Target objects is added to the model
        //for target form
        Target newTarget = new Target();
        newTarget.setGoalID(id);
        model.addAttribute("target", newTarget); // <--- form
        return "goal";//goal.html
    }
}
