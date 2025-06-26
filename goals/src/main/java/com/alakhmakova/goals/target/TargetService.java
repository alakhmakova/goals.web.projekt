package com.alakhmakova.goals.target;

import com.alakhmakova.goals.goal.Goal;
import com.alakhmakova.goals.goal.GoalRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
@Service
@Transactional
public class TargetService {

    private final TargetRepository targetRepository;
    private final GoalRepository goalRepository;

    public TargetService(TargetRepository targetRepository, GoalRepository goalRepository) {
        this.targetRepository = targetRepository;
        this.goalRepository = goalRepository;
    }

    public void saveTarget(Target saveTarget) {
        Goal goal = goalRepository.findById(saveTarget.getGoalID())
                .orElseThrow(() -> new NoSuchElementException("There is no goal with id " + saveTarget.getGoalID()));

        if (saveTarget.getStart() == null) {
            saveTarget.setStart("");
        }
        if (saveTarget.getTarget() == null) {
            saveTarget.setTarget("");
        }
        saveTarget.setCreated(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        saveTarget.setDeadline(saveTarget.getDeadlineDate() + " " + saveTarget.getDeadlineTime());
        saveTarget.setProgress(0);
        saveTarget.setTasks(List.of());
        targetRepository.save(saveTarget);
        List <Target> targets = targetRepository.findAllByGoalID(saveTarget.getGoalID());
        goal.setTargets(targets.stream().map(Target::getId).toList());
        goalRepository.save(goal);
    }
    public List<Target> getAllTargetsByGoalID(String goalID) {
        return targetRepository.findByGoalID(goalID);
    }

    public void deleteById(String id) {
        Target target = targetRepository.findById(id).orElseThrow(() -> new NoSuchElementException("There is no target with id " + id));
        log.info("Deleting target with id: {}", id);
        Goal goal = goalRepository.findById(target.getGoalID()).orElseThrow(() -> new NoSuchElementException("There is no goal with id " + target.getGoalID()));
        log.info("Target belongs to goal: {}", goal);
        targetRepository.deleteById(id);
        log.info("Target with id: {} has been successfully deleted", id);
        List <Target> targets = targetRepository.findAllByGoalID(goal.getId());
        log.info("Getting a list of targets for a goal with id: {}", goal.getId());
        goal.setTargets(targets.stream().map(Target::getId).toList());
        log.info("Updating goal with id: {} with new targets", goal.getId());
        goalRepository.save(goal);
        log.info("Saving updated goal: {}", goal);
    }

}
