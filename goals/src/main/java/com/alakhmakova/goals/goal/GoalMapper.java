package com.alakhmakova.goals.goal;

import jdk.jfr.Description;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Description("Converts a Goal entity to a GoalDTO")
public class GoalMapper {

    public GoalDTO toDTO(Goal goal) {
        if (goal == null) {
            return null;
        }
        GoalDTO dto = new GoalDTO();
        dto.setText(goal.getText());
        dto.setDate(goal.getDate());
        dto.setDescription(goal.getDescription());
        dto.setInFolder(goal.getInFolder());
        dto.setSharedWith(goal.getSharedWith() != null ? goal.getSharedWith(): new ArrayList<>());
        dto.setTargets(goal.getTargets() != null ? goal.getTargets() : new ArrayList<>());

        return dto;
    }

    @Description("Converts a list of Goal entities to a list of GoalDTO objects")
    public List<GoalDTO> toDTOList(List<Goal> goals) {
        return goals.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    }
