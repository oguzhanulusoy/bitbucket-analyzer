package com.orion.bitbucket.controller;

import com.orion.bitbucket.entity.Role;
import com.orion.bitbucket.entity.User;
import com.orion.bitbucket.requests.RegisterUserRequest;
import com.orion.bitbucket.requests.UserRequest;
import com.orion.bitbucket.responses.AuthResponse;
import com.orion.bitbucket.security.JwtTokenProvider;
import com.orion.bitbucket.service.RoleService;
import com.orion.bitbucket.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider,
                          UserService userService, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody UserRequest loginRequest) {
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), loginRequest.getPassword());
        Authentication auth = authenticationManager.authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(auth);
        String jwtToken = jwtTokenProvider.generateJwtToken(auth);
        User user = userService.getOneUserByUsername(loginRequest.getUsername());
        AuthResponse authResponse = new AuthResponse();
        authResponse.setToken("Bearer " + jwtToken);
        authResponse.setUserId(user.getId());
        authResponse.setRole(user.getRoleId().getRoleName());
        authResponse.setMessage("Login Success");
        return authResponse;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterUserRequest registerRequest) {
        AuthResponse authResponse = new AuthResponse();
        if (!registerRequest.getPassword().equals(registerRequest.getRepeat_password())) {
            authResponse.setMessage("Failed, Passwords not match");
            return new ResponseEntity<>(authResponse, HttpStatus.BAD_REQUEST);
        }
        if (userService.getOneUserByUsername(registerRequest.getUsername()) != null) {
            authResponse.setMessage("Username already in use.");
            return new ResponseEntity<>(authResponse, HttpStatus.BAD_REQUEST);
        }
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setFirstName(registerRequest.getFirst_name());
        user.setLastName(registerRequest.getLast_name());
        Role userRole = roleService.getOneRoleById(2L); // Changed 2l to 2L
        user.setRoleId(userRole);
        User registeredUser = userService.saveOneUser(user);
        authResponse.setMessage("User successfully registered.");
        authResponse.setUserId(registeredUser.getId());
        authResponse.setRole(registeredUser.getRoleId().getRoleName());
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }
}