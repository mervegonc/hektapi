package com.project.hektapi.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor // Tüm alanları içeren constructor oluşturur
@NoArgsConstructor  // Boş constructor oluşturur
public class ProductResponse {
    private UUID id;
    private String name;
    private String description;
    private String category;
    private Double price;
    private Integer stock;
    private List<String> images; // Eksikse ekleyelim!
}
