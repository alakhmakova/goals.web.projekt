package com.alakhmakova.goals.target;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

}
