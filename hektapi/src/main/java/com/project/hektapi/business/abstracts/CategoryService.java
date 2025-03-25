package com.project.hektapi.business.abstracts;

import com.project.hektapi.entity.Category;
import java.util.List;
import java.util.UUID;
import com.project.hektapi.dto.category.*;

public interface CategoryService {
    CategoryResponse addCategory(CategoryRequest categoryRequest);
    List<CategoryResponse> getAllCategories();
    CategoryResponse updateCategory(UUID id, CategoryRequest categoryRequest);
    void deleteCategory(UUID id);
    Category getCategoryById(UUID id);
    List<CategoryResponse> searchByName(String keyword);
}

