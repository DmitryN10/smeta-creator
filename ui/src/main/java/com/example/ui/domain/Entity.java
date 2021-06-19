package com.example.ui.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.stream.Stream;

@Table("entity")
@AllArgsConstructor
@Builder
@Setter
@Getter
public class Entity {
    @Id
    private Integer id;
    @Column("positionNumber")
    private final String positionNumber;
    @With
    private final String name;
    @With
    private final String type;
    private final Double cost1;
    private final Double cost2;
    private final Double cost3;
    private final Double cost4;
    private final Double cost5;
    private final Double cost6;

    public Entity withoutTrims(){
        return this.withName(name.trim()).withType(type.trim());
    }
}


