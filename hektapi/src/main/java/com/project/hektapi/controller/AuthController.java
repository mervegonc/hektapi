package com.project.hektapi.controller;

import java.util.List;
import java.util.UUID;
import com.project.hektapi.entity.User;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.hektapi.dto.auth.request.UserSigninRequest;
import com.project.hektapi.dto.auth.request.UserSignupRequest;
import com.project.hektapi.dto.auth.response.UserSigninResponse;
import com.project.hektapi.dto.auth.response.UserSignupResponse;
import com.project.hektapi.entity.User;
import com.project.hektapi.business.abstracts.UserService;

import lombok.AllArgsConstructor;


@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final UserService userService;


	@PostMapping("/signin")
	public ResponseEntity<UserSigninResponse> login(@RequestBody UserSigninRequest userSigninRequest) {
		String token = userService.login(userSigninRequest);
		UUID userId = userService.getUserIdByUsername(userSigninRequest.getUsernameOrEmail());
	
		// 🔥 Burada kullanıcıyı al ve rollerini hazırla
		User user = userService.getUserByUsernameOrEmail(userSigninRequest.getUsernameOrEmail());
		List<String> roleList = user.getRoles().stream()
    .map(role -> role.getName()) // 👈 eğer String ise .name() gerekmez
    .toList();

	
		// ✨ Response'a roller ekleniyor
		UserSigninResponse response = new UserSigninResponse();
		response.setToken(token);
		response.setUserId(userId);
		response.setRoles(roleList);
		response.setMessage("Giriş başarılı");
	
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	

	@PostMapping("/signup")
	public ResponseEntity<UserSignupResponse> signup(@RequestBody UserSignupRequest userSignupRequest) {
		boolean isUserExist = userService.isUserExist(userSignupRequest.getUsername());

		if (isUserExist) {
			UserSignupResponse response = new UserSignupResponse();
			response.setMessage("User already exists");
			return new ResponseEntity<>(response, HttpStatus.CONFLICT);
		}

		userService.signupAndAssignRole(userSignupRequest, "ROLE_USER");

		UserSignupResponse userSignupResponse = new UserSignupResponse();
		userSignupResponse.setMessage("User registered successfully!");
		return new ResponseEntity<>(userSignupResponse, HttpStatus.CREATED);
	}


}
