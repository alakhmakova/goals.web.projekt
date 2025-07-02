package com.alakhmakova.goals.target;

import jdk.jfr.Description;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TargetMapper {
    @Description("Converts a Target entity to a ProgressDTO")
    public TargetDTO toDTO(Target target) {
        if (target == null) {
            return null;
        }
        TargetDTO dto = new TargetDTO();
        dto.setName(target.getName());
        dto.setUnit(target.getUnit());
        dto.setStart(target.getStart());
        dto.setTarget(target.getTarget());
        dto.setCurrent(target.getCurrent());
        dto.setProgress(target.getProgress());
        dto.setDeadlineDate(target.getDeadlineDate());
        dto.setDeadlineTime(target.getDeadlineTime());

        return dto;
    }

    @Description("Converts a list of Target entities to a list of ProgressDTO objects")
    public List<TargetDTO> toDTOList(List<Target> targets) {
        return targets.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
