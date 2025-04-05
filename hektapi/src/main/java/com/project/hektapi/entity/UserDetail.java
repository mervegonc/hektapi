package com.project.hektapi.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_details")
public class UserDetail {

    @Id
@GeneratedValue
@Column(name = "id", updatable = false, nullable = false, columnDefinition = "CHAR(36)")
private UUID id;


    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "education", length = 255)
    private String education;

    @Column(name = "home_address", length = 255)
    private String homeAddress;

    @Column(name = "previous_experience", length = 500)
    private String previousExperience;

    @Column(name = "phone_number", length = 25)
    private String phoneNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "nationality", length = 50)
    private String nationality;

    @Column(name = "linkedin_profile", length = 255)
    private String linkedinProfile;

    @Column(name = "skills", length = 255)
    private String skills;

    @Column(name = "marital_status", length = 20)
    private String maritalStatus;

    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 16)
    private String emergencyContactPhone;

    @Column(name = "created_time", updatable = false)
    private Timestamp createdTime;

    @Column(name = "updated_time")
    private Timestamp updatedTime;

    @PrePersist
    protected void onCreate() {
        this.createdTime = new Timestamp(System.currentTimeMillis());
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedTime = new Timestamp(System.currentTimeMillis());
    }
}
