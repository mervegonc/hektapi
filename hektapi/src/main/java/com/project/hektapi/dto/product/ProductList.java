package com.project.hektapi.dto.product;

import com.project.hektapi.entity.Product;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ProductList {
    private UUID id;
    private String name;
    private String code;
    private String information;
    private String firstImageUrl;

    public ProductList(Product product, String firstImageUrl) {
        this.id = product.getId();
        this.name = product.getName();
        this.code = product.getCode();
        this.information = product.getInformation();
        this.firstImageUrl = firstImageUrl;
    }

    // Getter ve Setter'lar
}
