package com.alakhmakova.goals.goal;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController//use with a REST API
@RequestMapping("/api/goals")
public class GoalController {
    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public List<Goal> showGoals() {
        return goalService.getAllGoalsWithoutFolders();
    }
    @PatchMapping("/{goalId}")
    public GoalDTO updateWithPatch(@PathVariable (value = "goalId") String goalId,
                                   @RequestBody @Valid GoalDTO goalDto) {
        return new GoalDTO(goalService.updateSome(
                goalId,
                goalDto.getText(),
                Optional.ofNullable(goalDto.getDate()),
                Optional.ofNullable(goalDto.getDescription()),
                Optional.ofNullable(goalDto.getInFolder()),
                Optional.ofNullable(goalDto.getSharedWith()),
                Optional.ofNullable(goalDto.getTargets())));
    }

}
