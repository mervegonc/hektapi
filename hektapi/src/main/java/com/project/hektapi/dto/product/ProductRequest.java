package com.project.hektapi.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor // Tüm parametreleri alan bir constructor oluşturur
@NoArgsConstructor  // Parametresiz constructor oluşturur
public class ProductRequest {
    private String productName;
    private String description;
    private String category;
    private Double price;
    private Integer stock;
}
