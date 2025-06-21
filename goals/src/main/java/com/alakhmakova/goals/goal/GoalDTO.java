package com.alakhmakova.goals.goal;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoalDTO {
    private String text;//name of the goal
    private String date;//due to date
    private String description;
    private String inFolder;
    @Valid
    private List<@Email(message = "Invalid email format", regexp = ".+@.+\\..+") String> sharedWith = new ArrayList<>();
    private List<String> targets = new ArrayList<>();

    public GoalDTO(Goal goal) {
    }
}
