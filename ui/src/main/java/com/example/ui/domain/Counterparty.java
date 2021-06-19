package com.example.ui.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("counterparty")
@Builder
@Getter
@AllArgsConstructor
public class Counterparty {
    @Id
    private Integer id;
    @Column("positionNumber")
    @With
    private final String positionNumber;
    @With
    private final String name;
    @With
    private final String city;
    @With
    private final String region;
    @Column("regionId")
    private final Integer regionId;
    @With
    private final String index;
    @With
    private final String address;

    public Counterparty withoutTrims(){
        return this.withPositionNumber(positionNumber.trim()).withName(name.trim())
                .withCity(city.trim()).withRegion(region.trim()).withIndex(index.trim())
                .withAddress(address.trim());
    }
}
