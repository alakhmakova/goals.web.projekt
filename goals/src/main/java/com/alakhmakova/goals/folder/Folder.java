package com.alakhmakova.goals.folder;

import com.alakhmakova.goals.goal.Goal;
import jakarta.persistence.*;
import java.util.List;

public class Folder {
    @Id
    private String id;
    private String type;
    private String text;
    private String img;
    private String button;
    private List<Goal> goals;

    public Folder(String id, String type, String text, String img, String button, List<Goal> goals) {
        this.id = id;
        this.type = type;
        this.text = text;
        this.img = img;
        this.button = button;
        this.goals = goals;
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

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getButton() {
        return button;
    }

    public void setButton(String button) {
        this.button = button;
    }

    public List<Goal> getGoals() {
        return goals;
    }

    public void setGoals(List<Goal> goals) {
        this.goals = goals;
    }

    @Override
    public String toString() {
        return "Folder{" +
                "id='" + id + '\'' +
                ", type='" + type + '\'' +
                ", text='" + text + '\'' +
                ", img='" + img + '\'' +
                ", button='" + button + '\'' +
                ", goals=" + goals +
                '}';
    }
}
