package com.alakhmakova.goals.target;
import com.alakhmakova.goals.exception.TargetNotFoundException;
import com.alakhmakova.goals.goal.Goal;
import com.alakhmakova.goals.goal.GoalService;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import jdk.jfr.Description;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static java.lang.Integer.parseInt;

@Slf4j
@Service
@Transactional
public class TargetService {

    private final TargetRepository targetRepository;
    private final GoalService goalService;

    public TargetService(TargetRepository targetRepository, GoalService goalService) {
        this.targetRepository = targetRepository;
        this.goalService = goalService;
    }

    public void saveTarget(Target saveTarget) {
        Goal goal = goalService.verifyGoalById(saveTarget.getGoalID());

        if (saveTarget.getStart() == null) {
            saveTarget.setStart("0");
        }
        if (saveTarget.getTarget() == null) {
            saveTarget.setTarget("0");
        }
        if (saveTarget.getCurrent() == null) {
            saveTarget.setCurrent("0");
        }
        if (saveTarget.getTarget().isEmpty() && saveTarget.getStart().isEmpty() && saveTarget.getCurrent().isEmpty() ) {
            saveTarget.setProgress(0);
            log.info("Target '{}' has progress value 0", saveTarget.getName());
        } else {
            saveTarget.setProgress(countTargetProgress(saveTarget));
            log.info("Target has progress value {}", saveTarget.getProgress());
        }
        saveTarget.setCreated(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        saveTarget.setDeadline(saveTarget.getDeadlineDate() + " " + saveTarget.getDeadlineTime());
        saveTarget.setTasks(List.of());
        targetRepository.save(saveTarget);
        List <Target> targets = targetRepository.findAllByGoalID(saveTarget.getGoalID());
        goal.setTargets(targets.stream().map(Target::getId).toList());
        goalService.save(goal);
    }
    public List<Target> getAllTargetsByGoalID(String goalID) {
        return targetRepository.findByGoalID(goalID);
    }

    public void deleteById(String id) {
        Target target = verifyTargetById(id);
        log.info("Deleting target with id: {}", id);
        Goal goal = goalService.verifyGoalById(target.getGoalID());
        log.info("Target belongs to goal: {}", goal);
        targetRepository.deleteById(id);
        log.info("Target with id: {} has been successfully deleted", id);
        List <Target> targets = targetRepository.findAllByGoalID(goal.getId());
        log.info("Getting a list of targets for a goal with id: {}", goal.getId());
        goal.setTargets(targets.stream().map(Target::getId).toList());
        log.info("Updating goal with id: {} with new targets", goal.getId());
        goalService.save(goal);
        log.info("Saving updated goal: {}", goal);
    }

    public Target updateSomeTargetFields(String targetId,
                                         @NotBlank Optional<String> name,
                                         Optional<String> unit,
                                         Optional<String> start,
                                         Optional<String> target,
                                         Optional<String> current,
                                         Optional<Number> progress,
                                         Optional<String> deadlineTime,
                                         Optional<String> deadlineDate) throws TargetNotFoundException {

        Target updatedTarget = verifyTargetById(targetId);
        name.ifPresent(updatedTarget::setName);
        unit.ifPresent(updatedTarget::setUnit);
        start.ifPresent(updatedTarget::setStart);
        target.ifPresent(updatedTarget::setTarget);
        current.ifPresent(updatedTarget::setCurrent);
        progress.ifPresentOrElse(updatedTarget::setProgress, () -> {updatedTarget.setProgress(countTargetProgress(updatedTarget));});
        deadlineDate.ifPresent(updatedTarget::setDeadlineDate);
        deadlineTime.ifPresent(updatedTarget::setDeadlineTime);

        return targetRepository.save(updatedTarget);
    }

    @Description("Utility methods")
    /*public Number countTargetProgress(Target target) {
        Number progress = 0;
        if(target.getStart() == null || target.getStart().isEmpty()) {
            target.setStart("0");
        }
        if(target.getTarget() == null || target.getTarget().isEmpty()) {
            target.setTarget("0");
        }
        if(target.getCurrent() == null || target.getCurrent().isEmpty()) {
            target.setCurrent("0");
        }
        if (target.getType() == Type.number || target.getType()== Type.currency) {
            try {
                progress =
                        (Math.abs((Integer.parseInt(target.getCurrent()) - Integer.parseInt(target.getStart()) * 100.0f)))
                                / (Math.abs(Integer.parseInt(target.getTarget()) - Integer.parseInt(target.getStart())))*100;
            } catch (NumberFormatException e) {
                progress = 0;
                progress = (
                        (Math.abs(Float.parseFloat(target.getCurrent()) - Float.parseFloat(target.getStart())))
                                / (Math.abs(Float.parseFloat(target.getTarget())) - Float.parseFloat(target.getStart()))
                ) * 100.0f;


            }
        } *//*else if (target.getType() == Type.success) {

        }
        else if (target.getType() == Type.tasks) {

        }*//*
        log.info("Target {} has progress {}", target, progress);
        return progress;
    }*/
    public Number countTargetProgress(Target target) {
        Number progress = 0;
        if (target.getStart() == null || target.getStart().isEmpty()) {
            target.setStart("0");
        }
        if (target.getTarget() == null || target.getTarget().isEmpty()) {
            target.setTarget("0");
        }
        if (target.getCurrent() == null || target.getCurrent().isEmpty()) {
            target.setCurrent("0");
        }
        if (target.getType() == Type.number || target.getType() == Type.currency) {
            try {
                int start = Integer.parseInt(target.getStart());
                int targetValue = Integer.parseInt(target.getTarget());
                int current = Integer.parseInt(target.getCurrent());
                if (targetValue == start) {
                    progress = 0;
                } else {
                    progress = Math.abs((current - start) * 100.0f / (targetValue - start));
                }
            } catch (NumberFormatException e) {
                try {
                    float start = Float.parseFloat(target.getStart());
                    float targetValue = Float.parseFloat(target.getTarget());
                    float current = Float.parseFloat(target.getCurrent());
                    if (targetValue == start) {
                        progress = 0;
                    } else {
                        progress = Math.abs((current - start) * 100.0f / (targetValue - start));
                    }
                } catch (NumberFormatException ex) {
                    progress = 0;
                }
            }
        }
        log.info("Target {} has progress {}", target, progress);
        return progress;
    }
    public Target verifyTargetById(String id) {
        return targetRepository.findById(id)
                .orElseThrow(() -> new TargetNotFoundException("Target not found, id: " + id));
    }
}
