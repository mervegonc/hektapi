package com.project.hektapi.repository;

import com.project.hektapi.entity.ProductAttributeKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProductAttributeKeyRepository extends JpaRepository<ProductAttributeKey, UUID> {
    List<ProductAttributeKey> findByProductId(UUID productId);
}
