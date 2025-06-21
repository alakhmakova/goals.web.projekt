package com.alakhmakova.goals.target;

import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
@Data
@Document(collection = "target")
public class Target {

    @Id
    private String id;
    private String goalID;
    private String name;
    private String created;
    private String deadlineDate;
    private String deadlineTime;
    private String deadline;
    private String type;
    private String unit;
    private String start;
    private String target;
    private int tasksAmount;
    private List<String> tasks = new ArrayList<>();

    public Target() {
        // Default constructor
    }


}
