package com.project.hektapi.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateRequest {
    private String name;
    private String information;
    private String code;
    private UUID categoryId;
    private List<AttributeDTO> attributes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttributeDTO {
        private UUID id;  // ✅ Güncellenmesi için ID artık zorunlu!
        private String key;
        private String value;
    }
}
