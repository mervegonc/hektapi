package com.project.hektapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.hektapi.entity.UserRole;
import java.util.List;
import java.util.UUID;
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    List<UserRole> findByUserId(UUID userId);
}
