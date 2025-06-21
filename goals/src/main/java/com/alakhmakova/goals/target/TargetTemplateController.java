package com.alakhmakova.goals.target;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class TargetTemplateController {
    public final TargetService targetService;

    public TargetTemplateController(TargetService targetService) {
        this.targetService = targetService;
    }

    @PostMapping("/target")
    public String saveTarget(@RequestParam(value = "unit", required = false) String unit,
                             @RequestParam(value = "start", required = false) String start,
                             @RequestParam(value = "target", required = false) String targetNumber,
                             @ModelAttribute Target target) {
        target.setUnit(unit);
        target.setStart(start);
        target.setTarget(targetNumber);
        targetService.saveTarget(target);
        return "redirect:/goal/" + target.getGoalID();
    }
}
