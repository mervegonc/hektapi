package com.project.hektapi.dto.product;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProductRequest {
    private String productName;
    private String description;
    private String category;
    private Double price;
    private Integer stock;
}
