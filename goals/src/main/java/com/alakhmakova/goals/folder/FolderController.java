package com.alakhmakova.goals.folder;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    private final FolderService folderService;


    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @GetMapping
    public List<Folder> showFolders() {
        List<Folder> folders = folderService.getAllFolders();
        return folders;
    }

}
