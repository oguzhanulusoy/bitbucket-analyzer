package com.orion.bitbucket.controller;

import com.orion.bitbucket.entity.User;
import com.orion.bitbucket.requests.UpdateUserDetailsRequest;
import com.orion.bitbucket.security.JwtTokenProvider;
import com.orion.bitbucket.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    private UserService userService;
    private JwtTokenProvider jwtTokenProvider;

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @GetMapping
    public List<User> getAllUser(){
        return userService.getAllUsers();
    }

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @PostMapping
    public User crateUser(@RequestBody User newUser){
        return userService.saveOneUser(newUser);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getOneUserById(@RequestHeader Map<String, String> headers, @PathVariable Long userId){
        GrantedAuthority userRole = jwtTokenProvider.getRoleFromToken(headers.get("authorization").substring(7));
        Long requestUserId = jwtTokenProvider.getUserIdFromJwt(headers.get("authorization").substring(7));
        if (userRole.getAuthority().equals("SUPER_USER") || requestUserId == userId)
            return ResponseEntity.ok(userService.getOneUserById(userId));

        return ResponseEntity.status(403).body(null);
    }


    @PutMapping("/{userId}")
    public ResponseEntity<User> updateOneUser(@RequestHeader Map<String, String> headers, @PathVariable Long userId, @RequestBody UpdateUserDetailsRequest newUser){
        GrantedAuthority userRole = jwtTokenProvider.getRoleFromToken(headers.get("authorization").substring(7));
        Long requestUserId = jwtTokenProvider.getUserIdFromJwt(headers.get("authorization").substring(7));

        if (userRole.getAuthority().equals("SUPER_USER") || requestUserId == userId)
            return ResponseEntity.ok(userService.updateOneUser(userId,newUser));
        
        return ResponseEntity.status(403).body(null);
    }

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @DeleteMapping("/{userId}")
    public void deleteOneUser(@PathVariable Long userId){
        userService.deleteById(userId);
    }
}
