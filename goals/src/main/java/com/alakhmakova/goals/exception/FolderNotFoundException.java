package com.alakhmakova.goals.exception;

import jakarta.persistence.EntityNotFoundException;

public class FolderNotFoundException extends EntityNotFoundException {
    public FolderNotFoundException(String message) {
        super(message);
    }
}
