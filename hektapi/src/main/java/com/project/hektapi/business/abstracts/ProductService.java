package com.project.hektapi.business.abstracts;

import com.project.hektapi.entity.Product;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ProductService {
    Product addProduct(Product product, List<MultipartFile> files);
}
