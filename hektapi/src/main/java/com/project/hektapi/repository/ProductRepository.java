package com.project.hektapi.repository;

import com.project.hektapi.entity.Product;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    @Transactional
    void deleteById(UUID productId);
}