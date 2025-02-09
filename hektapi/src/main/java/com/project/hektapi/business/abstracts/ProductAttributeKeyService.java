package com.project.hektapi.business.abstracts;

import com.project.hektapi.entity.ProductAttributeKey;
import java.util.List;
import java.util.UUID;

public interface ProductAttributeKeyService {
    void saveProductAttributeKeys(List<ProductAttributeKey> attributes, UUID productId);
}
