package com.project.hektapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.hektapi.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Role findByName(String name);
}
