package com.alakhmakova.goals.target;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TargetDTO {
    private String name;
    private String unit;
    private String start;
    private String target;
    private String current;
    private Number progress;
    private String deadlineDate;
    private String deadlineTime;

    public TargetDTO(Target target) {
    }
}
