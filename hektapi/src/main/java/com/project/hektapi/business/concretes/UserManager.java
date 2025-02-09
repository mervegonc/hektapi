    package com.project.hektapi.business.concretes;


    import java.sql.Timestamp;
    import java.util.HashSet;
    import java.util.Optional;
    import java.util.Set;
    import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.security.core.userdetails.UsernameNotFoundException;
    import org.springframework.stereotype.Service;
    import org.springframework.security.crypto.password.PasswordEncoder;

    import com.project.hektapi.dto.auth.request.UserSigninRequest;
    import com.project.hektapi.dto.auth.request.UserSignupRequest;
    import com.project.hektapi.dto.request.UserDetailUpdateRequest;
import com.project.hektapi.dto.response.UserDetailResponse;
import com.project.hektapi.entity.Role;
    import com.project.hektapi.entity.User;
    import com.project.hektapi.entity.UserDetail;
    import com.project.hektapi.jwt.JwtTokenProvider;
    import com.project.hektapi.repository.RoleRepository;
    import com.project.hektapi.repository.UserDetailRepository;
    import com.project.hektapi.repository.UserRepository;
    import com.project.hektapi.business.abstracts.UserService;

    import org.springframework.security.core.Authentication;

    @Service
    public class UserManager implements UserService {

        @Autowired
        private UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private final JwtTokenProvider jwtTokenProvider;
        private final RoleRepository roleRepository;
        private final UserDetailRepository userDetailRepository;

        
    public UserManager(UserDetailRepository userDetailRepository,RoleRepository roleRepository, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        
            this.passwordEncoder = passwordEncoder;
            this.authenticationManager = authenticationManager;
            this.jwtTokenProvider = jwtTokenProvider;
            this.roleRepository = roleRepository;
            this.userDetailRepository =userDetailRepository;
            
        }



        @Override
        public String login(UserSigninRequest userSigninRequest) {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userSigninRequest.getUsernameOrEmail(), userSigninRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = jwtTokenProvider.generateToken(authentication);

            return token;
        }

        @Override
        public void signup(UserSignupRequest userSignupRequest) {
            if (isUserExist(userSignupRequest.getUsername())) {
                throw new RuntimeException("User already exists!");
            }

            User user = new User();
            user.setUsername(userSignupRequest.getUsername());
            user.setEmail(userSignupRequest.getEmail());
            user.setPassword(passwordEncoder.encode(userSignupRequest.getPassword()));

            user.setCreatedTime(new Timestamp(System.currentTimeMillis()));

            Role userRole = roleRepository.findByName("USER");
            Set<Role> roles = new HashSet<>();
            roles.add(userRole);
            user.setRoles(roles);

            userRepository.save(user);
        }

        @Override
        public void signupAndAssignRole(UserSignupRequest userSignupRequest, String roleName) {
            User user = new User();
            user.setUsername(userSignupRequest.getUsername());
            user.setEmail(userSignupRequest.getEmail());
            user.setPassword(passwordEncoder.encode(userSignupRequest.getPassword()));

            Role userRole = roleRepository.findByName(roleName);
            if (userRole == null) {
                throw new RuntimeException("Role not found: " + roleName);
            }

            Set<Role> roles = new HashSet<>();
            roles.add(userRole);
            user.setRoles(roles);

            userRepository.save(user);
        }

        @Override
        public boolean isUserExist(String username) {
            return userRepository.existsByUsername(username);
        }


        @Override
        public UUID getUserIdByUsername(String usernameOrEmail) {
            User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail).orElseThrow(
                    () -> new UsernameNotFoundException("User not found by username or email: " + usernameOrEmail));
            return user.getId();
        }



       
        @Override
        public void createUserDetails(UserDetailUpdateRequest request) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserDetail userDetail = new UserDetail();
            userDetail.setUser(user);
            userDetail.setEducation(request.getEducation());
            userDetail.setHomeAddress(request.getHomeAddress());
            userDetail.setPreviousExperience(request.getPreviousExperience());
            userDetail.setPhoneNumber(request.getPhoneNumber());
            userDetail.setLinkedinProfile(request.getLinkedinProfile());
            userDetail.setSkills(request.getSkills());
            userDetail.setMaritalStatus(request.getMaritalStatus());
            userDetail.setEmergencyContactName(request.getEmergencyContactName());
            userDetail.setEmergencyContactPhone(request.getEmergencyContactPhone());
            userDetail.setDateOfBirth(request.getDateOfBirth());
            userDetail.setNationality(request.getNationality());

            // Set created time
            userDetail.setCreatedTime(new Timestamp(System.currentTimeMillis()));

            userDetailRepository.save(userDetail);
        }

        @Override
        public boolean updateUserDetails(UserDetailUpdateRequest request) {
            UUID userId = request.getUserId();
            Optional<UserDetail> existingUserDetail = userDetailRepository.findByUserId(userId);
        
            if (existingUserDetail.isPresent()) {
                UserDetail userDetail = existingUserDetail.get();
        
                // Eğer istek içinde bir değer varsa onu güncelle, yoksa eski değeri koru.
                if (request.getEducation() != null) userDetail.setEducation(request.getEducation());
                if (request.getHomeAddress() != null) userDetail.setHomeAddress(request.getHomeAddress());
                if (request.getPreviousExperience() != null) userDetail.setPreviousExperience(request.getPreviousExperience());
                if (request.getPhoneNumber() != null) userDetail.setPhoneNumber(request.getPhoneNumber());
                if (request.getLinkedinProfile() != null) userDetail.setLinkedinProfile(request.getLinkedinProfile());
                if (request.getSkills() != null) userDetail.setSkills(request.getSkills());
                if (request.getMaritalStatus() != null) userDetail.setMaritalStatus(request.getMaritalStatus());
                if (request.getEmergencyContactName() != null) userDetail.setEmergencyContactName(request.getEmergencyContactName());
                if (request.getEmergencyContactPhone() != null) userDetail.setEmergencyContactPhone(request.getEmergencyContactPhone());
                if (request.getDateOfBirth() != null) userDetail.setDateOfBirth(request.getDateOfBirth());
                if (request.getNationality() != null) userDetail.setNationality(request.getNationality());
        
                userDetailRepository.save(userDetail);
                return true;
            }
        
            return false;
        }
        

      

        @Override
        public Optional<UserDetail> getUserDetailsById(UUID userId) {
            return userDetailRepository.findByUserId(userId);
        }





    
        public void createUserDetails(UUID userId, UserDetailUpdateRequest request) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
            UserDetail userDetail = new UserDetail();
            userDetail.setUser(user);  // Kullanıcı detayına user atanıyor
            userDetail.setEducation(request.getEducation());
            userDetail.setHomeAddress(request.getHomeAddress());
            userDetail.setPreviousExperience(request.getPreviousExperience());
            userDetail.setPhoneNumber(request.getPhoneNumber());
            userDetail.setLinkedinProfile(request.getLinkedinProfile());
            userDetail.setSkills(request.getSkills());
            userDetail.setMaritalStatus(request.getMaritalStatus());
            userDetail.setEmergencyContactName(request.getEmergencyContactName());
            userDetail.setEmergencyContactPhone(request.getEmergencyContactPhone());
            userDetail.setDateOfBirth(request.getDateOfBirth());
            userDetail.setNationality(request.getNationality());
        
            userDetailRepository.save(userDetail);
        }
        
        @Override
        public boolean updateUserDetails(UUID userId, UserDetailUpdateRequest request) {
            Optional<UserDetail> userDetailOpt = userDetailRepository.findByUserId(userId);
    
            if (userDetailOpt.isPresent()) {
                UserDetail userDetail = userDetailOpt.get();
    
                userDetail.setEducation(request.getEducation());
                userDetail.setHomeAddress(request.getHomeAddress());
                userDetail.setPreviousExperience(request.getPreviousExperience());
                userDetail.setPhoneNumber(request.getPhoneNumber());
                userDetail.setLinkedinProfile(request.getLinkedinProfile());
                userDetail.setSkills(request.getSkills());
                userDetail.setMaritalStatus(request.getMaritalStatus());
                userDetail.setEmergencyContactName(request.getEmergencyContactName());
                userDetail.setEmergencyContactPhone(request.getEmergencyContactPhone());
                userDetail.setDateOfBirth(request.getDateOfBirth());
                userDetail.setNationality(request.getNationality());
    
                userDetail.setUpdatedTime(new Timestamp(System.currentTimeMillis()));
    
                userDetailRepository.save(userDetail);
                return true;
            }
    
            return false;
        }
    
        @Override
        public boolean deleteUserDetails(UUID userId) {
            Optional<UserDetail> existingUserDetail = userDetailRepository.findByUserId(userId);
        
            if (existingUserDetail.isPresent()) {
                userDetailRepository.delete(existingUserDetail.get());
                return true;
            }
        
            return false;
        }
        


@Override
public Optional<UserDetailResponse> getUserDetailsByUserId(UUID userId) {
    Optional<UserDetail> userDetailOpt = userDetailRepository.findByUserId(userId);
    
    if (userDetailOpt.isEmpty()) {
        return Optional.empty();
    }

    UserDetail userDetail = userDetailOpt.get();
    User user = userDetail.getUser();

    Set<String> roleNames = user.getRoles().stream()
                                .map(Role::getName)
                                .collect(Collectors.toSet());

    UserDetailResponse response = new UserDetailResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            userDetail.getPhoneNumber(),
            userDetail.getEducation(),
            userDetail.getHomeAddress(),
            roleNames
    );

    return Optional.of(response);
}

    }
