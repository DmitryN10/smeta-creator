package com.example.ui.repository;

import com.example.ui.domain.Counterparty;
import com.example.ui.domain.Entity;
import org.springframework.data.repository.CrudRepository;

public interface CounterpatyRepository extends CrudRepository<Counterparty, Integer> {
//    Entity getByPositionNumber(Integer id);
}
