package com.alakhmakova.goals.exception;

import jakarta.persistence.EntityNotFoundException;

public class GoalNotFoundException extends EntityNotFoundException {
    public GoalNotFoundException(String message) {
        super(message);
    }
}
