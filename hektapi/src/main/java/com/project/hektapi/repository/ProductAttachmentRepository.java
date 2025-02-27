package com.project.hektapi.repository;

import com.project.hektapi.entity.ProductAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductAttachmentRepository extends JpaRepository<ProductAttachment, UUID> {
    List<ProductAttachment> findByProductId(UUID productId);
    Optional<ProductAttachment> findByProductIdAndFileUrl(UUID productId, String fileUrl);
    Optional<ProductAttachment> findByProductIdAndFileUrlContaining(UUID productId, String fileName);
    void deleteByProductId(UUID productId);

    
}
