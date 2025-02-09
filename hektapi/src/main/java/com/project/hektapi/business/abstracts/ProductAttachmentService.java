package com.project.hektapi.business.abstracts;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.UUID;

public interface ProductAttachmentService {
    void saveProductAttachments(UUID productId, List<MultipartFile> files);
}
