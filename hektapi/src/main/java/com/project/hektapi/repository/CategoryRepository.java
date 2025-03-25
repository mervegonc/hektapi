package com.project.hektapi.repository;

import com.project.hektapi.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByNameContainingIgnoreCase(String keyword);

}
