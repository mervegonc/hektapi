package com.project.hektapi.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class ProductDetailResponse {
    private String id;
    private String name;
    private String information;
    private String code;
    private String categoryName;
    private List<String> images;
    private List<AttributeDTO> attributes;

    @Data
    @AllArgsConstructor
    public static class AttributeDTO {
        private UUID id; 
        private String key;
        private String value;
    }
}
