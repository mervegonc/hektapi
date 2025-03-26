package com.project.hektapi.business.abstracts;

import com.project.hektapi.dto.product.ProductAttributeCreateRequest;
import com.project.hektapi.dto.product.ProductDetailResponse;
import com.project.hektapi.dto.product.ProductList;
import com.project.hektapi.dto.product.ProductRequest;
import com.project.hektapi.dto.product.ProductResponse;
import com.project.hektapi.dto.product.ProductUpdateRequest;
import com.project.hektapi.entity.Product;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ProductService {
    ProductResponse addProduct(ProductRequest productRequest, List<MultipartFile> files);
    List<ProductList> getAllProducts();
    ResponseEntity<Resource> getProductImage(String productId, String fileName);
    ProductDetailResponse getProductById(UUID productId);
void deleteAllProducts();
ProductResponse updateProduct(UUID productId, ProductUpdateRequest updateRequest);
 ResponseEntity<String> addProductAttribute(ProductAttributeCreateRequest request);
 void deleteImage(UUID productId, String fileName);
 void addMultipleProductImages(UUID productId, List<MultipartFile> files);
 void deleteProductCompletely(UUID productId);
 void deleteProductAttribute(UUID productId, UUID attributeId);
 void deleteProductAttributeByKeyValue(UUID productId, String key, String value);
 List<Product> searchProducts(String keyword);
 List<ProductList> getProductsByCategory(UUID categoryId);

}
