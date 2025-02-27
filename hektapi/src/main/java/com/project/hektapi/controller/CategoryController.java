package com.project.hektapi.controller;

import com.project.hektapi.business.abstracts.CategoryService;
import com.project.hektapi.dto.category.CategoryRequest;
import com.project.hektapi.dto.category.CategoryResponse;
import com.project.hektapi.entity.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("/add")
    public ResponseEntity<CategoryResponse> addCategory(@RequestBody CategoryRequest categoryRequest) {
        return ResponseEntity.ok(categoryService.addCategory(categoryRequest));
    }
    
    @PostMapping("/add-direct")
    public ResponseEntity<CategoryResponse> addCategoryDirect(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.addCategory(new CategoryRequest(category.getName())));
    }
    

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }



    /**
     * Tüm kategorileri getirir
     */
    @GetMapping("/all")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable UUID id, @RequestBody Category category) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Kategori başarıyla silindi.");
    }
}
