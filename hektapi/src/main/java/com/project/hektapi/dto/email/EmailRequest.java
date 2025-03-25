package com.project.hektapi.dto.email;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailRequest {
    private String userEmail; // Kullanıcının girdiği e-posta
    private String subject; // Kullanıcının belirlediği konu
    private String message; // Kullanıcının yazdığı mesaj
    private String productName; // Ürün adı (otomatik set edilecek)
    private String productCode; // Ürün kodu (otomatik set edilecek)
}
