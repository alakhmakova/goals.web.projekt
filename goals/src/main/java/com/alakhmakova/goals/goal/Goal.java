package com.alakhmakova.goals.goal;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    public Goal(String id, String type, String text, int progressTarget, String button, String date, String description, String inFolder, String owner, List<String> sharedWith, List<String> targets) {
        this.id = id;
        this.type = type;
        this.text = text;
        this.progressTarget = progressTarget;
        this.button = button;
        this.date = date;
        this.description = description;
        this.inFolder = inFolder;
        this.owner = owner;
        this.sharedWith = sharedWith;
        this.targets = targets;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int getProgressTarget() {
        return progressTarget;
    }

    public void setProgressTarget(int progressTarget) {
        this.progressTarget = progressTarget;
    }

    public String getButton() {
        return button;
    }

    public void setButton(String button) {
        this.button = button;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInFolder() {
        return inFolder;
    }

    public void setInFolder(String inFolder) {
        this.inFolder = inFolder;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public List<String> getSharedWith() {
        return sharedWith;
    }

    public void setSharedWith(List<String> sharedWith) {
        this.sharedWith = sharedWith;
    }

    public List<String> getTargets() {
        return targets;
    }

    public void setTargets(List<String> targets) {
        this.targets = targets;
    }

    @Override
    public String toString() {
        return "Goal{" +
                "id='" + id + '\'' +
                ", type='" + type + '\'' +
                ", text='" + text + '\'' +
                ", progressTarget=" + progressTarget +
                ", button='" + button + '\'' +
                ", date='" + date + '\'' +
                ", description='" + description + '\'' +
                ", inFolder='" + inFolder + '\'' +
                ", owner='" + owner + '\'' +
                ", sharedWith=" + sharedWith +
                ", targets=" + targets +
                '}';
    }
}
