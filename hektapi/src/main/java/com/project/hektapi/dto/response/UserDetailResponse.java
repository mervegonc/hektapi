package com.project.hektapi.dto.response;

import java.util.Set;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDetailResponse {
    private UUID userId;
    private String username;
    private String email;
    private String phoneNumber;
    private String education;
    private String homeAddress;
    private Set<String> roles; // Kullanıcının rollerini string olarak döndürüyoruz.
}
