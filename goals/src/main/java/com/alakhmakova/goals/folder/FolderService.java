package com.alakhmakova.goals.folder;

import com.alakhmakova.goals.exception.FolderNotFoundException;
import com.alakhmakova.goals.exception.GoalNotFoundException;
import com.alakhmakova.goals.goal.Goal;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class FolderService {
    //field marked as final, indicating that it cannot be subsequently changed
    private final FolderRepository folderRepository;

    //Dependency is injected through the constructor
    public FolderService(FolderRepository folderRepository) {
        this.folderRepository = folderRepository;
    }

    public List<Folder> getAllFolders() {
        return folderRepository.findAll();
    }
    private Folder verifyFolderById(String id) throws NoSuchElementException {
        return folderRepository.findById(id)
                .orElseThrow(() -> new FolderNotFoundException("Folder not found, id: " + id));
    }

}
