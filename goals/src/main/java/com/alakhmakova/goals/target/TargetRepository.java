package com.alakhmakova.goals.target;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TargetRepository extends MongoRepository<Target, String> {
    List<Target> findByGoalID(String goalID);
    List<Target> findAllByGoalID(String goalID);
}
