package com.alakhmakova.goals.folder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FolderRepository extends MongoRepository<Folder, String> {
}
