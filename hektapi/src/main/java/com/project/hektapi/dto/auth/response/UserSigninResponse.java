package com.project.hektapi.dto.auth.response;


import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSigninResponse  {

    private String token;
    private String type = "Bearer";
    //private String username;
    private UUID userId;
   // private String tokenType = "Bearer";

   private List<String> roles;
    private String message;

 
}