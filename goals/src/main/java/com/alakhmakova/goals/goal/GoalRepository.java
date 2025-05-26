package com.alakhmakova.goals.goal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends MongoRepository<Goal, String>{

    List<Goal> findByInFolder(String inFolder);

    List<Goal> id(String id);
}
