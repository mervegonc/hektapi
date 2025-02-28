package com.project.hektapi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "product_attachment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    
    private String fileUrl;
    private String fileType; // "image" veya "video"

    public void setProduct(Product product) {
        this.product = product;
    }
}
