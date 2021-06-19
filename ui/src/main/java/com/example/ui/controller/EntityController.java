package com.example.ui.controller;

import com.example.ui.domain.Counterparty;
import com.example.ui.domain.Entity;
import com.example.ui.repository.CounterpatyRepository;
import com.example.ui.repository.EntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

import static com.example.ui.InitializeData.counterparties;
import static com.example.ui.InitializeData.getEntities;
import static java.util.stream.Collectors.toList;

@RestController
public class EntityController {
    @Autowired
    private EntityRepository entityRepository;
    @Autowired
    private CounterpatyRepository counterpatyRepository;

    @GetMapping(value = "/all")
    public List<Entity> getAll() {
        Iterable<Entity> all = entityRepository.findAll();
        ArrayList<Entity> entities = new ArrayList<>();
        all.forEach(entities::add);
        return entities.stream().map(Entity::withoutTrims).collect(toList());
    }
    @GetMapping(value = "/allCounterparties")
    public List<Counterparty> getAllCounterparties() {
        Iterable<com.example.ui.domain.Counterparty> all = counterpatyRepository.findAll();
        ArrayList<com.example.ui.domain.Counterparty> entities = new ArrayList<>();
        all.forEach(entities::add);
        return entities.stream().map(Counterparty::withoutTrims).collect(toList());
    }

    @PostMapping("/save")
    public void save(@RequestBody Entity entity) {
        entityRepository.save(entity);
    }

    @GetMapping("/saveAll")
    public String save() {
        entityRepository.saveAll(getEntities());
        return "Saved entities";
    }

    @GetMapping("/saveCounterparties")
    public String saveCounterparties() {
        counterpatyRepository.saveAll(counterparties());
        return "Saved counterparties";
    }
}
