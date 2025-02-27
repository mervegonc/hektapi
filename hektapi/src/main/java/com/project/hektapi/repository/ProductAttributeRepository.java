package com.project.hektapi.repository;

import com.project.hektapi.entity.ProductAttachment;
import com.project.hektapi.entity.ProductAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductAttributeRepository extends JpaRepository<ProductAttribute, UUID> {
    List<ProductAttribute> findByProductId(UUID productId);
    Optional<ProductAttribute> findByProductIdAndKey(UUID productId, String key);
    void deleteByProductId(UUID productId);
     
}
