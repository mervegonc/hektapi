package com.project.hektapi.business.concretes;

import com.project.hektapi.business.abstracts.CategoryService;
import com.project.hektapi.dto.category.CategoryRequest;
import com.project.hektapi.dto.category.CategoryResponse;
import com.project.hektapi.entity.Category;
import com.project.hektapi.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryManager implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponse addCategory(CategoryRequest categoryRequest) {
        Category category = new Category();
        category.setName(categoryRequest.getName());
        category = categoryRepository.save(category);

        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getProducts() != null ? category.getProducts().size() : 0
        );
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
            .map(cat -> new CategoryResponse(
                cat.getId(),
                cat.getName(),
                cat.getProducts() != null ? cat.getProducts().size() : 0
            ))
            .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse updateCategory(UUID id, CategoryRequest categoryRequest) {
        Category existing = getCategoryById(id);
        existing.setName(categoryRequest.getName());
        Category updated = categoryRepository.save(existing);

        return new CategoryResponse(
            updated.getId(),
            updated.getName(),
            updated.getProducts() != null ? updated.getProducts().size() : 0
        );
    }

    @Override
    public void deleteCategory(UUID id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public Category getCategoryById(UUID id) {
        return categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Kategori bulunamadı!"));
    }

    @Override
    public List<CategoryResponse> searchByName(String keyword) {
        return categoryRepository.findByNameContainingIgnoreCase(keyword).stream()
            .map(cat -> new CategoryResponse(
                cat.getId(),
                cat.getName(),
                cat.getProducts() != null ? cat.getProducts().size() : 0
            ))
            .collect(Collectors.toList());
    }
}
