package com.alakhmakova.goals.target;

import com.alakhmakova.goals.goal.GoalDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/targets")
public class TargetController {
    private final TargetService targetService;


    public TargetController(TargetService targetService) {
        this.targetService = targetService;
    }

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteTarget(@PathVariable String id) {
        targetService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<Target> getTarget(@PathVariable String id) {
        Target target = targetService.verifyTargetById(id);

        if (target != null) {
            return ResponseEntity.ok(target);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{targetId}")
    public TargetDTO updateWithPatch(@PathVariable (value = "targetId") String targetId,
                                   @RequestBody @Valid TargetDTO targetDTO) {
        return new TargetDTO(targetService.updateSomeTargetFields(
                targetId,
                Optional.ofNullable(targetDTO.getName()),
                Optional.ofNullable(targetDTO.getUnit()),
                Optional.ofNullable(targetDTO.getStart()),
                Optional.ofNullable(targetDTO.getTarget()),
                Optional.ofNullable(targetDTO.getCurrent()),
                Optional.ofNullable(targetDTO.getProgress()),
                Optional.ofNullable(targetDTO.getDeadlineTime()),
                Optional.ofNullable(targetDTO.getDeadlineDate())));
    }
}
