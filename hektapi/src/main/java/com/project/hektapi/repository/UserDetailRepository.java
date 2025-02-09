package com.project.hektapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.hektapi.entity.UserDetail;

import java.util.Optional;
import java.util.UUID;

public interface UserDetailRepository extends JpaRepository<UserDetail, UUID> {


    Optional<UserDetail> findById(UUID id);

    Optional<UserDetail> findByUserId(UUID userId);

    

}
