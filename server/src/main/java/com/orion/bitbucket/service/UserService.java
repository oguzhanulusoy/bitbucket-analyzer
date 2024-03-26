package com.orion.bitbucket.service;


import com.orion.bitbucket.entity.Role;
import com.orion.bitbucket.entity.User;
import com.orion.bitbucket.repository.UserRepository;
import com.orion.bitbucket.requests.UpdateUserDetailsRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {

    UserRepository userRepository;
    RoleService roleService;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User saveOneUser(User newUser) {
        return userRepository.save(newUser);
    }

    public User getOneUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public User updateOneUser(Long userId, UpdateUserDetailsRequest newUser) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent())
        {
            User foundUser = user.get();
            foundUser.setFirstName(newUser.getFirstName());
            foundUser.setLastName(newUser.getLastName());
            foundUser.setEmail(newUser.getEmail());
            Role newRole = roleService.getOneRoleById(newUser.getRoleId());
            foundUser.setRoleId(newRole);
            userRepository.save(foundUser);
            return foundUser;
        }
        else
        {
            return null;
        }
    }

    public void deleteById(Long userId) {
        userRepository.deleteById(userId);
    }

    public User getOneUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
