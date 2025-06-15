package com.alakhmakova.goals.target;

import com.alakhmakova.goals.goal.Goal;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TargetService {

    private final TargetRepository targetRepository;

    public TargetService(TargetRepository targetRepository) {
        this.targetRepository = targetRepository;
    }

    /*public Target saveTarget(String goalID, String name, String type) {
        Target saveTarget = new Target();
        saveTarget.setGoalID(goalID);
        saveTarget.setName(name);
        saveTarget.setCreated(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")));
        saveTarget.setType(type);
        saveTarget.setUnit("unit");
        saveTarget.setStart("");
        saveTarget.setTarget("");
        saveTarget.setTasksAmount(0);
        saveTarget.setTasks(List.of());
        return targetRepository.save(saveTarget);
    }*/
    public Target saveTarget(Target saveTarget) {
        saveTarget.setCreated(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        saveTarget.setDeadline(saveTarget.getDeadlineDate() + " " + saveTarget.getDeadlineTime());
        saveTarget.setTasksAmount(0);
        saveTarget.setTasks(List.of());
        return targetRepository.save(saveTarget);
    }
    public List<Target> getAllTargetsByGoalID(String goalID) {
        return targetRepository.findByGoalID(goalID);
    }
    public Target getTargetByTargetID(String targetID) {
        return targetRepository.findByTargetID(targetID);
    }


}
