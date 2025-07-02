package com.alakhmakova.goals.target;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

import static java.lang.Integer.parseInt;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "target")
public class Target {

    @Id
    private String id;
    private String goalID;
    @NotEmpty// must not be null nor empty
    private String name;
    private String created /*= LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))*/;
    private String deadlineDate;
    private String deadlineTime;
    private String deadline = deadlineDate + " " + deadlineTime;
    @Enumerated(EnumType.STRING)
    private Type type;
    @Size(max = 20)//string must not be longer than 20 characters
    private String unit;
    private String start;
    private String target;
    private String current;
    private Number progress;
    private List<String> tasks = new ArrayList<>();
}
