package com.alakhmakova.goals.goal;

import jakarta.persistence.Id;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Goal {
    @Id//annotation is used to mark a field as the primary key of an entity in JPA
    private String id;//for MongoDB
    private String type;
    private String text;
    private int progressTarget;
    private String button;
    private String date;
    private String description;
    private String inFolder;
    private String owner;
    private List<String> sharedWith = new ArrayList<>();
    private List<String> targets = new ArrayList<>();

    public Goal() {

    }
}
