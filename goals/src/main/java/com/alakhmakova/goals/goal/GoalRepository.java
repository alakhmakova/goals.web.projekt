package com.alakhmakova.goals.goal;

import com.alakhmakova.goals.target.Target;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoalRepository extends MongoRepository<Goal, String>{

    List<Goal> findByInFolder(String inFolder);

}
