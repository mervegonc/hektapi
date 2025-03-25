package com.project.hektapi.business.concretes;

import com.project.hektapi.business.abstracts.ProductService;
import com.project.hektapi.dto.product.*;
import com.project.hektapi.entity.*;
import com.project.hektapi.repository.*;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.File;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductManager implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductAttachmentRepository productAttachmentRepository;
    private final ProductAttributeRepository productAttributeRepository;
    private final ProductAttachmentRepository attachmentRepository;

    private final String UPLOAD_DIR = "C:/projects/hektapi/hektapi/uploads/products/";

    @Override
    public ProductResponse addProduct(ProductRequest productRequest, List<MultipartFile> files) {
        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Kategori bulunamadı!"));

        // ✅ Yeni ürün oluştur
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setInformation(productRequest.getInformation());
        product.setCode(productRequest.getCode());
        product.setCategory(category);
        final Product savedProduct = productRepository.save(product);

        // ✅ Ürün klasörü oluştur
        String productFolder = UPLOAD_DIR + savedProduct.getId() + "/";
        File folder = new File(productFolder);
        if (!folder.exists()) folder.mkdirs();

        // ✅ Dosyaları kaydet
        List<ProductAttachment> attachments = files.stream().map(file -> {
            String filePath = saveFile(file, productFolder);
            ProductAttachment attachment = new ProductAttachment();
            attachment.setProduct(savedProduct);
            attachment.setFileUrl(filePath);
            attachment.setFileType(file.getContentType());
            return productAttachmentRepository.save(attachment);
        }).collect(Collectors.toList());

        // ✅ Ürün özelliklerini kaydet
        List<ProductAttribute> attributes = productRequest.getAttributes().stream().map(attr -> {
            ProductAttribute attribute = new ProductAttribute();
            attribute.setProduct(savedProduct);
            attribute.setKey(attr.getKey());
            attribute.setValue(attr.getValue());
            return productAttributeRepository.save(attribute);
        }).collect(Collectors.toList());

        // ✅ Response döndür
        return new ProductResponse(
                savedProduct.getId().toString(),
                savedProduct.getName(),
                savedProduct.getCode(),
                savedProduct.getCategory().getName(),
                attachments.stream().map(ProductAttachment::getFileUrl).collect(Collectors.toList()),
                attributes.stream()
                        .map(attr -> attr.getKey() + ": " + attr.getValue())
                        .collect(Collectors.toList())
        );
    }



    @Override
    public List<ProductList> getAllProducts() {
        return productRepository.findAll().stream().map(product -> {
            List<ProductAttachment> attachments = attachmentRepository.findByProductId(product.getId());
            String firstImageUrl = attachments.isEmpty() ? null : attachments.get(0).getFileUrl();
            return new ProductList(product, firstImageUrl);
        }).collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<Resource> getProductImage(String productId, String fileName) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR + productId + "/" + fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @Override
    public ProductDetailResponse getProductById(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı!"));

        // ✅ Resimleri al
        List<String> images = productAttachmentRepository.findByProductId(productId)
                .stream()
                .map(ProductAttachment::getFileUrl)
                .toList();

        // ✅ Özellikleri al
        List<ProductDetailResponse.AttributeDTO> attributes = productAttributeRepository.findByProductId(productId)
                .stream()
                .map(attr -> new ProductDetailResponse.AttributeDTO(
                    attr.getId(),
                        attr.getKey(),
                        attr.getValue()
                ))
                .toList();

        return new ProductDetailResponse(
                product.getId().toString(),
                product.getName(),
                product.getInformation(),
                product.getCode(),
                product.getCategory().getName(),
                images,
                attributes
        );
    }

    @Transactional
    @Override
    public ProductResponse updateProduct(UUID productId, ProductUpdateRequest updateRequest) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı!"));
    
        // ✅ Ürün bilgilerini güncelle
        if (updateRequest.getName() != null) product.setName(updateRequest.getName());
        if (updateRequest.getInformation() != null) product.setInformation(updateRequest.getInformation());
        if (updateRequest.getCode() != null) product.setCode(updateRequest.getCode());
    
        // ✅ **Mevcut özellikleri güncelle, yeni ekleme YAPMA**
        if (updateRequest.getAttributes() != null) {
            for (ProductUpdateRequest.AttributeDTO attrDTO : updateRequest.getAttributes()) {
                if (attrDTO.getId() != null) {
                    // **Eğer ID varsa, sadece güncelleme yap**
                    ProductAttribute existingAttribute = productAttributeRepository.findById(attrDTO.getId())
                            .orElseThrow(() -> new RuntimeException("Özellik bulunamadı!"));
    
                    System.out.println("🔄 Güncellenecek Özellik: " + existingAttribute.getKey() + " - " + existingAttribute.getValue());
                    System.out.println("🆕 Yeni Değer: " + attrDTO.getKey() + " - " + attrDTO.getValue());
    
                    existingAttribute.setKey(attrDTO.getKey());
                    existingAttribute.setValue(attrDTO.getValue());
                    productAttributeRepository.save(existingAttribute);
                } else {
                    System.out.println("⚠️ ID olmayan özellik güncellenmiyor!");
                }
            }
        }
    
        productRepository.save(product);
    
        return new ProductResponse(
                product.getId().toString(),
                product.getName(),
                product.getCode(),
                product.getCategory().getName(),
                null, null);
    }
    
    

    @Transactional
    @Override
    public void deleteAllProducts() {
        // 1️⃣ Veritabanındaki tüm ürünleri ve ilişkili verileri sil
        productRepository.deleteAll();

        // 2️⃣ uploads/products içindeki tüm dosyaları sil
        File directory = new File(UPLOAD_DIR);
        if (directory.exists()) {
            deleteDirectory(directory);
        }
    }


    @Transactional
    @Override
    public ResponseEntity<String> addProductAttribute(ProductAttributeCreateRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı!"));

        // **Eğer bu key zaten varsa, yeni bir ekleme yapmıyoruz!**
        Optional<ProductAttribute> existingAttribute = productAttributeRepository
                .findByProductIdAndKey(request.getProductId(), request.getKey());

        if (existingAttribute.isPresent()) {
            return ResponseEntity.badRequest().body("Bu key zaten var. Yeni ekleme yapılamaz.");
        }

        // **Yeni özellik ekleme**
        ProductAttribute newAttribute = new ProductAttribute();
        newAttribute.setProduct(product);
        newAttribute.setKey(request.getKey());
        newAttribute.setValue(request.getValue());

        productAttributeRepository.save(newAttribute);
        return ResponseEntity.ok("Yeni özellik başarıyla eklendi.");
    }



    @Transactional
@Override
public void addMultipleProductImages(UUID productId, List<MultipartFile> files) {
    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Ürün bulunamadı!"));

    String productFolder = UPLOAD_DIR + product.getId() + "/";
    File folder = new File(productFolder);
    if (!folder.exists()) folder.mkdirs();

    files.forEach(file -> {
        String filePath = saveFile(file, productFolder);
        ProductAttachment attachment = new ProductAttachment();
        attachment.setProduct(product);
        attachment.setFileUrl(filePath);
        attachment.setFileType(file.getContentType());
        productAttachmentRepository.save(attachment);
    });
}


private String saveFile(MultipartFile file, String folderPath) {
    try {
        if (file.isEmpty()) throw new RuntimeException("Boş dosya yüklenemez!");
        String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
        String fileName = UUID.randomUUID().toString() + extension;
        File destFile = new File(folderPath + fileName);
        file.transferTo(destFile);
        return folderPath + fileName;
    } catch (Exception e) {
        throw new RuntimeException("Dosya yükleme hatası!", e);
    }
}



    private void deleteDirectory(File directory) {
        if (directory.isDirectory()) {
            for (File file : directory.listFiles()) {
                deleteDirectory(file);
            }
        }
        directory.delete();
    }
   

    @Transactional
    public void deleteImage(UUID productId, String fileName) {
        // 🔥 Veritabanında dosyanın tam yolunu bul
        Optional<ProductAttachment> attachment = productAttachmentRepository.findByProductIdAndFileUrlContaining(productId, fileName);

        if (attachment.isPresent()) {
            String filePath = attachment.get().getFileUrl();
            File file = new File(filePath);

            // 🛑 Eğer dosya fiziksel olarak varsa sil
            if (file.exists()) {
                if (file.delete()) {
                    // ✅ Başarıyla silindiyse veritabanından da sil
                    productAttachmentRepository.delete(attachment.get());
                } else {
                    throw new RuntimeException("Dosya silinemedi!");
                }
            } else {
                throw new RuntimeException("Dosya bulunamadı!");
            }
        } else {
            throw new RuntimeException("Resim veritabanında bulunamadı!");
        }
    }



    @Transactional
    @Override
    public void deleteProductCompletely(UUID productId) {
        // 1️⃣ Resimleri ve dosyaları sil
        List<String> imagePaths = productAttachmentRepository.findByProductId(productId)
                .stream().map(ProductAttachment::getFileUrl).toList();
    
        for (String filePath : imagePaths) {
            File file = new File(filePath);
            if (file.exists()) {
                file.delete();
            }
        }
    
        // 2️⃣ Ürün klasörünü sil
        File productFolder = new File(UPLOAD_DIR + productId);
        if (productFolder.exists() && productFolder.isDirectory()) {
            deleteDirectory(productFolder); // ✅ Bu metot ile klasörü tamamen sil
        }
    
        // 3️⃣ Veritabanındaki tüm ilişkili verileri sil
        productAttachmentRepository.deleteByProductId(productId);
        productAttributeRepository.deleteByProductId(productId);
        productRepository.deleteById(productId);
    }
    
    @Transactional
    @Override
    public void deleteProductAttribute(UUID productId, UUID attributeId) {
        // 🛑 Ürün kontrolü
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı!"));

        // 🛑 Özellik kontrolü
        ProductAttribute attribute = productAttributeRepository.findById(attributeId)
                .orElseThrow(() -> new RuntimeException("Özellik bulunamadı!"));

        // 🔥 Özellik gerçekten bu ürüne mi ait?
        if (!attribute.getProduct().getId().equals(productId)) {
            throw new RuntimeException("Bu özellik bu ürüne ait değil!");
        }

        // 🗑️ Özelliği sil
        productAttributeRepository.delete(attribute);
    }

    @Transactional
@Override
public void deleteProductAttributeByKeyValue(UUID productId, String key, String value) {
    // 1) Ürün var mı kontrol et
    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Ürün bulunamadı!"));

    // 2) İlgili key-value çifti var mı?
    ProductAttribute attribute = productAttributeRepository
            .findByProductIdAndKeyAndValue(productId, key, value)
            .orElseThrow(() -> new RuntimeException("Bu key-value çifti ürün üzerinde bulunamadı!"));

    // 3) Silme işlemi
    productAttributeRepository.delete(attribute);
}
@Override
public List<Product> searchProducts(String keyword) {
    return productRepository.searchByNameOrCode(keyword);
}
}
