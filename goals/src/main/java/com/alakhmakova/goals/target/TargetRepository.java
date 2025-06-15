package com.alakhmakova.goals.target;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TargetRepository extends MongoRepository<Target, String> {
    List<Target> findByGoalID(String goalID);

    Target findByTargetID(String targetID);
}
