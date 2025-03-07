package com.project.hektapi.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.hektapi.business.abstracts.ProductService;
import com.project.hektapi.dto.product.ProductAttributeCreateRequest;
import com.project.hektapi.dto.product.ProductDetailResponse;
import com.project.hektapi.dto.product.ProductList;
import com.project.hektapi.dto.product.ProductRequest;
import com.project.hektapi.dto.product.ProductResponse;
import com.project.hektapi.dto.product.ProductUpdateRequest;
import com.project.hektapi.entity.ProductAttachment;

import lombok.RequiredArgsConstructor;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<ProductResponse> addProduct(
            @RequestPart("product") String productJson,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        // JSON'u `ProductRequest` nesnesine çevir
        ObjectMapper objectMapper = new ObjectMapper();
        ProductRequest productRequest;
        try {
            productRequest = objectMapper.readValue(productJson, ProductRequest.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body(null);
        }

        // Servise yönlendir
        ProductResponse response = productService.addProduct(productRequest, files);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ProductList>> getAllProducts() {
        List<ProductList> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/uploads/products/{productId}/{fileName}")
    public ResponseEntity<Resource> getProductImage(@PathVariable String productId, @PathVariable String fileName) {
        return productService.getProductImage(productId, fileName);
    }

    @GetMapping("/{id}")
public ResponseEntity<ProductDetailResponse> getProductById(@PathVariable UUID   id) {
    return ResponseEntity.ok(productService.getProductById(id));
}

@PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable UUID id,
            @RequestBody ProductUpdateRequest updateRequest) {
        return ResponseEntity.ok(productService.updateProduct(id, updateRequest));  
    }

@PreAuthorize("hasRole('ROLE_ADMIN')") // 🔥 Sadece Admin kullanabilir
    @PostMapping("/add-attribute")
    public ResponseEntity<String> addProductAttribute(@RequestBody ProductAttributeCreateRequest request) {
        return productService.addProductAttribute(request);
 
 
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/{productId}/upload-images")
    public ResponseEntity<String> uploadMultipleImages(
            @PathVariable UUID productId,
            @RequestParam("files") List<MultipartFile> files) {
        productService.addMultipleProductImages(productId, files);
        return ResponseEntity.ok("Resimler başarıyla yüklendi!");
    }
    
    




    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/delete-all")
    public ResponseEntity<String> deleteAllProducts() {
        productService.deleteAllProducts();
        return ResponseEntity.ok("Tüm ürünler ve dosyalar başarıyla silindi.");
    }



    @DeleteMapping("/{productId}/delete-image")
    public ResponseEntity<String> deleteProductImage(@PathVariable UUID productId, @RequestParam String fileName) {
        try {
            productService.deleteImage(productId, fileName);
            return ResponseEntity.ok("Resim başarıyla silindi!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')") 
@DeleteMapping("/{productId}/delete-completely")
public ResponseEntity<String> deleteProductCompletely(@PathVariable UUID productId) {
    productService.deleteProductCompletely(productId);
    return ResponseEntity.ok("Ürün ve tüm ilişkili veriler başarıyla silindi.");
}




    @DeleteMapping("/{productId}/attributes/{attributeId}")
    public ResponseEntity<String> deleteProductAttribute(
            @PathVariable UUID productId,
            @PathVariable UUID attributeId) {

        productService.deleteProductAttribute(productId, attributeId);
        return ResponseEntity.ok("Özellik başarıyla silindi!");
    }


    // package com.project.hektapi.controller;

@DeleteMapping("/{productId}/attributes/delete-by-key-value")
public ResponseEntity<String> deleteProductAttributeByKeyValue(
        @PathVariable UUID productId,
        @RequestParam String key,
        @RequestParam String value
) {
    productService.deleteProductAttributeByKeyValue(productId, key, value);
    return ResponseEntity.ok("Belirtilen key-value özelliği başarıyla silindi!");
}

    
}
