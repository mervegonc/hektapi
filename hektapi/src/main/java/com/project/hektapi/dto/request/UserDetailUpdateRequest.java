package com.project.hektapi.dto.request;

import java.util.UUID;


import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserDetailUpdateRequest {

    @NotNull(message = "User ID cannot be null")
    private UUID userId;  // Include the userId to map the relationship between User and UserDetail

    @NotNull(message = "Education cannot be null")
    private String education;

    private String homeAddress;
    private String previousExperience;
    private String phoneNumber;
    private String linkedinProfile;
    private String skills;
    private String maritalStatus;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private LocalDate dateOfBirth;
    private String nationality;
}
