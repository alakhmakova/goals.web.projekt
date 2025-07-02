package com.alakhmakova.goals.exception;

import jakarta.persistence.EntityNotFoundException;

public class TargetNotFoundException extends EntityNotFoundException {
    public TargetNotFoundException(String message) {
        super(message);
    }
}
