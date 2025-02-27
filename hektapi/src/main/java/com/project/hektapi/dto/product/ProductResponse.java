package com.project.hektapi.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ProductResponse {
    private String id;
    private String name;
    private String code;
    private String category;
    private List<String> fileUrls;
    private List<String> attributes;
}
