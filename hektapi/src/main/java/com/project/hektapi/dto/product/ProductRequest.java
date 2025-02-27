package com.project.hektapi.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {
    private String name;
    private String information;
    private String code;
    private UUID categoryId;  // ✅ UUID tipi doğru!
    private List<ProductAttributeRequest> attributes;
}
