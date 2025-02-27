package com.project.hektapi.business.abstracts;

import com.project.hektapi.entity.Category;
import java.util.List;
import java.util.UUID;
import com.project.hektapi.dto.category.*;

public interface CategoryService {


    CategoryResponse addCategory(CategoryRequest categoryRequest);
    List<CategoryResponse> getAllCategories();
    Category addCategory(Category category);
   
    Category updateCategory(UUID id, Category category);
    void deleteCategory(UUID id);
    Category getCategoryById(UUID id);
}
