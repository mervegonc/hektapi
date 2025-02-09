package com.project.hektapi.controller;

import com.project.hektapi.business.abstracts.ProductService;
import com.project.hektapi.entity.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(@ModelAttribute Product product,
                                              @RequestParam("files") List<MultipartFile> files) {
        Product createdProduct = productService.addProduct(product, files);
        return ResponseEntity.ok(createdProduct);
    }
}
