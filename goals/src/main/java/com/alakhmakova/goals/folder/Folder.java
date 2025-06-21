package com.alakhmakova.goals.folder;

import com.alakhmakova.goals.goal.Goal;
import jakarta.persistence.Id;
import lombok.Data;

import java.util.List;
@Data
public class Folder {
    @Id
    private String id;
    private String type;
    private String text;
    private String img;
    private String button;
    private List<Goal> goals;
}
