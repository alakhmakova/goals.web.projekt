package com.alakhmakova.goals.target;

import com.alakhmakova.goals.goal.Goal;
import com.alakhmakova.goals.goal.GoalService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Controller
public class TargetTemplateController {
    public final TargetService targetService;

    public TargetTemplateController(TargetService targetService) {
        this.targetService = targetService;
    }



    /*@GetMapping("/goal{id}")
    public String getAllTargetsByGoalId(@PathVariable String goalID, Model model) {
        List<Target> targets = targetService.getAllTargetsByGoalID(goalID);
        model.addAttribute("targets", targets);// List of Target objects is added to the model
        return "goal";//goal.html
    }*/
}
