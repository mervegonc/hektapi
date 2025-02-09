package com.project.hektapi.controller;


import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



import com.project.hektapi.dto.request.UserDetailUpdateRequest;
import com.project.hektapi.dto.response.UserDetailResponse;
import com.project.hektapi.business.abstracts.UserService;
import lombok.AllArgsConstructor;



@AllArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {

    
	private final UserService userService;
    @PostMapping("/details")
    public ResponseEntity<String> createUserDetails(@RequestBody UserDetailUpdateRequest request) {
        UUID userId = request.getUserId(); // userId artık request body'den geliyor
    
        userService.createUserDetails(userId, request);
        return new ResponseEntity<>("User details created successfully", HttpStatus.CREATED);
    }
    
@GetMapping("/details/{userId}")
public ResponseEntity<?> getUserDetails(@PathVariable UUID userId) {
    Optional<UserDetailResponse> userDetails = userService.getUserDetailsByUserId(userId); // Güncellendi

    return userDetails.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
}


   
    @PutMapping("/details")
    public ResponseEntity<String> updateUserDetails(@RequestBody UserDetailUpdateRequest request) {
        boolean updated = userService.updateUserDetails(request);
        if (updated) {
            return new ResponseEntity<>("User details updated successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User details not found.", HttpStatus.NOT_FOUND);
        }
    }
    

    // Kullanıcı detaylarını oluştur veya güncelle
   
    // Kullanıcı detaylarını sil
    @DeleteMapping("/details")
    public ResponseEntity<String> deleteUserDetails(@RequestParam UUID userId) {
        boolean deleted = userService.deleteUserDetails(userId);
        return deleted ? ResponseEntity.ok("User details deleted successfully.")
                       : ResponseEntity.status(HttpStatus.NOT_FOUND).body("User details not found.");
    }
    




}
