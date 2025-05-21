package com.alakhmakova.goals.folder;

import org.springframework.stereotype.Service;

import java.util.List;

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

}
