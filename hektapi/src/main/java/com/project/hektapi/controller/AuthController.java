package com.project.hektapi.controller;

import java.util.UUID;

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
		System.out.println(userSigninRequest.getPassword());
		UUID userId = userService.getUserIdByUsername(userSigninRequest.getUsernameOrEmail());
		UserSigninResponse userSigninResponse = new UserSigninResponse();
		userSigninResponse.setToken(token);
		userSigninResponse.setUserId(userId);
		return new ResponseEntity<>(userSigninResponse, HttpStatus.OK);
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
