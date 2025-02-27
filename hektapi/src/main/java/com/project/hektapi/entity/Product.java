package com.project.hektapi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    private String name;
    @Column(length = 1500)
    private String information;
    private String code;
  
    @ManyToOne
@JoinColumn(name = "category_id", columnDefinition = "UUID", nullable = false)
private Category category;


@OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<ProductAttribute> attributes;



    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductAttachment> attachments;
}
