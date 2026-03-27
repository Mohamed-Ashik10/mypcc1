package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.model.UserRole;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Get all users with searching and filtering.
     * @param search   Search term for name or email (e.g. "Ashik")
     * @param role     Filter by role (e.g. "SUPER_ADMIN")
     */
    @GetMapping
    public List<User> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UserRole role) {
        
        List<User> users;
        
        // 1. Get filtered list
        if (search != null && !search.isEmpty()) {
            users = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search);
        } else {
            users = userRepository.findAll();
        }

        // 2. Further filter by role if provided
        if (role != null) {
            return users.stream()
                    .filter(u -> u.getRole() == role)
                    .collect(Collectors.toList());
        }

        return users;
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable String id) {
        return userRepository.findById(id).orElse(null);
    }
}
