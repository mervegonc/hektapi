package com.project.hektapi.business.abstracts;

import java.util.Optional;
import java.util.UUID;

import com.project.hektapi.dto.auth.request.UserSigninRequest;
import com.project.hektapi.dto.auth.request.UserSignupRequest;
import com.project.hektapi.dto.request.UserDetailUpdateRequest;
import com.project.hektapi.dto.response.UserDetailResponse;
import com.project.hektapi.entity.User;
import com.project.hektapi.entity.UserDetail;

public interface UserService {




    User getUserByUsernameOrEmail(String usernameOrEmail);


    void createUserDetails(UserDetailUpdateRequest request);
    boolean updateUserDetails(UserDetailUpdateRequest request);

Optional<UserDetailResponse> getUserDetailsByUserId(UUID userId);

    String login(UserSigninRequest userSigninRequest);

	void signup(UserSignupRequest userSignupRequest);

	void signupAndAssignRole(UserSignupRequest userSignupRequest, String roleName);
    boolean isUserExist(String userName);

    UUID getUserIdByUsername(String usernameOrEmail);


     Optional<UserDetail> getUserDetailsById(UUID userId);

     boolean deleteUserDetails(UUID userId);
    void createUserDetails(UUID userId, UserDetailUpdateRequest request);

    boolean updateUserDetails(UUID userId, UserDetailUpdateRequest request);


}
