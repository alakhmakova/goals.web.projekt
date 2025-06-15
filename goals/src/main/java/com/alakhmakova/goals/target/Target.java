package com.alakhmakova.goals.target;

import jakarta.persistence.Id;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Target {

    @Id
    private String targetID;
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

    public String getTargetID() {
        return targetID;
    }

    public void setTargetID(String targetID) {
        this.targetID = targetID;
    }

    public String getGoalID() {
        return goalID;
    }

    public void setGoalID(String goalID) {
        this.goalID = goalID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }
    public String getDeadlineTime() {
        return deadlineTime;
    }
    public void setDeadlineTime(String deadlineTime) {
        this.deadlineTime = deadlineTime;
    }
    public String getDeadlineDate() {
        return deadlineDate;
    }
    public void setDeadlineDate(String deadlineDate) {
        this.deadlineDate = deadlineDate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public int getTasksAmount() {
        return tasksAmount;
    }

    public void setTasksAmount(int tasksAmount) {
        this.tasksAmount = tasksAmount;
    }

    public List<String> getTasks() {
        return tasks;
    }

    public void setTasks(List<String> tasks) {
        this.tasks = tasks;
    }

    @Override
    public String toString() {
        return "Target{" +
                "targetID='" + targetID + '\'' +
                ", goalID='" + goalID + '\'' +
                ", name='" + name + '\'' +
                ", created='" + created + '\'' +
                ", deadlineDate=" + deadlineDate +
                ", deadlineTime=" + deadlineTime +
                ", deadline='" + deadline + '\'' +
                ", type='" + type + '\'' +
                ", unit='" + unit + '\'' +
                ", start='" + start + '\'' +
                ", target='" + target + '\'' +
                ", tasksAmount=" + tasksAmount +
                ", tasks=" + tasks +
                '}';
    }
}
