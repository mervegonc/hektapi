package com.project.hektapi.business.concretes;

import com.project.hektapi.business.abstracts.ProductAttributeKeyService;
import com.project.hektapi.entity.Product;
import com.project.hektapi.entity.ProductAttributeKey;
import com.project.hektapi.repository.ProductAttributeKeyRepository;
import com.project.hektapi.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductAttributeKeyManager implements ProductAttributeKeyService {

    private final ProductAttributeKeyRepository attributeKeyRepository;
    private final ProductRepository productRepository;

    @Override
    public void saveProductAttributeKeys(List<ProductAttributeKey> attributes, UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı!"));

        for (ProductAttributeKey key : attributes) {
            key.setProduct(product);
        }

        attributeKeyRepository.saveAll(attributes);
    }
}
