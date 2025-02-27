package com.project.hektapi.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductAttributeCreateRequest {
    private UUID productId; // Ürüne ait ID
    private String key;      // Yeni özelliğin adı
    private String value;    // Yeni özelliğin değeri
}
