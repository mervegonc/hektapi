package com.project.hektapi.business.concretes;

import com.project.hektapi.business.abstracts.ProductService;
import com.project.hektapi.entity.Product;
import com.project.hektapi.entity.ProductAttachment;
import com.project.hektapi.repository.ProductRepository;
import com.project.hektapi.repository.ProductAttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductManager implements ProductService {

    private final ProductRepository productRepository;
    private final ProductAttachmentRepository attachmentRepository;
    private static final String UPLOAD_DIR = "C:/projects/hektapi/hektapi/uploads/products/";

    @Override
    public Product addProduct(Product product, List<MultipartFile> files) {
        // Ürünü kaydet
        product = productRepository.save(product);
        saveProductAttachments(product.getId(), files);
        return product;
    }

    private void saveProductAttachments(UUID productId, List<MultipartFile> files) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı!"));
    
        List<ProductAttachment> attachments = new ArrayList<>();
        String folderPath = UPLOAD_DIR + productId + "/";
        File folder = new File(folderPath);
        if (!folder.exists()) folder.mkdirs();
    
        for (MultipartFile file : files) {
            try {
                String filePath = folderPath + file.getOriginalFilename();
                file.transferTo(new File(filePath));
    
                String fileType = file.getContentType().startsWith("image") ? "image" : "video";
    
                ProductAttachment attachment = new ProductAttachment();
                attachment.setProduct(product); // 🔹 Burada doğrudan veritabanındaki Product nesnesi kullanılıyor
                attachment.setFileUrl(filePath);
                attachment.setFileType(fileType);
                attachments.add(attachment);
    
            } catch (IOException e) {
                throw new RuntimeException("Dosya yüklenirken hata oluştu: " + e.getMessage());
            }
        }
    
        attachmentRepository.saveAll(attachments);
    }
    
}
