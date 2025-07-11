package com.alakhmakova.goals.target;
import com.alakhmakova.goals.goal.GoalDTO;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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

    @PostMapping("/goal/{goalId}")
    public String updateWithPatch(@PathVariable("goalId") String goalId,
                                  @RequestParam("targetId") String targetId,
                                  @ModelAttribute @Valid TargetDTO targetDTO,
                                  BindingResult bindingResult) { // Lägg till BindingResult för valideringsfel

        if (bindingResult.hasErrors()) {
            // Här kan du hantera valideringsfel
            // Till exempel, logga felen eller returnera till formulärsidan med felmeddelanden
            System.out.println("Validation errors: " + bindingResult.getAllErrors());
            // return "your-form-page"; // Returnera till formulärsidan om du vill visa fel
        }

        new TargetDTO(targetService.updateSomeTargetFields(
                targetId,
                Optional.ofNullable(targetDTO.getName()),
                Optional.ofNullable(targetDTO.getUnit()),
                Optional.ofNullable(targetDTO.getStart()),
                Optional.ofNullable(targetDTO.getTarget()),
                Optional.ofNullable(targetDTO.getCurrent()),
                Optional.ofNullable(targetDTO.getProgress()),
                Optional.ofNullable(targetDTO.getDeadlineTime()),
                Optional.ofNullable(targetDTO.getDeadlineDate())));
        return "redirect:/goal/" + goalId;
    }


}
