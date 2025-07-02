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
            saveTarget.setStart("");
        }
        if (saveTarget.getTarget() == null) {
            saveTarget.setTarget("");
        }
        if (Objects.equals(saveTarget.getTarget(), null) && Objects.equals(saveTarget.getStart(), null) && Objects.equals(saveTarget.getCurrent(), null)) {
            saveTarget.setProgress(0);
        } else {
            saveTarget.setProgress(countTargetProgress(saveTarget));
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
    public Number countTargetProgress(Target target) {
        Number progress = 0;
        if(target.getStart() == null) {
            target.setStart("");
        }
        if(target.getTarget() == null) {
            target.setTarget("");
        }
        if(target.getCurrent() == null) {
            target.setCurrent("");
        }
        if (target.getType() == Type.number || target.getType()== Type.currency) {
            try {
                progress =
                        ((Integer.parseInt(target.getCurrent()) - Integer.parseInt(target.getStart())))
                                / (Math.abs(Integer.parseInt(target.getTarget()) - Integer.parseInt(target.getStart())))
                                * 100;
            } catch (NumberFormatException e) {
                progress = (
                        (Float.parseFloat(target.getCurrent()) - Float.parseFloat(target.getStart()))
                                / (Math.abs(Float.parseFloat(target.getTarget())) - Float.parseFloat(target.getStart()))
                ) * 100.0f;


            }
        } /*else if (target.getType() == Type.success) {

        }
        else if (target.getType() == Type.tasks) {

        }*/
        log.info("Target {} has progress {}", target, progress);
        return progress;
    }
    public Target verifyTargetById(String id) {
        return targetRepository.findById(id)
                .orElseThrow(() -> new TargetNotFoundException("Target not found, id: " + id));
    }
}
