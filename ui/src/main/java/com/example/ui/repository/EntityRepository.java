package com.example.ui.repository;

import com.example.ui.domain.Entity;
import org.springframework.data.repository.CrudRepository;

public interface EntityRepository extends CrudRepository<Entity, Integer> {
//    Entity getByPositionNumber(Integer id);
}
