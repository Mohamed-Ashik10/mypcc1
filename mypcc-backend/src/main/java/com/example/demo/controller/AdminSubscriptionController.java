package com.example.demo.controller;

import com.example.demo.model.Subscription;
import com.example.demo.model.User;
import com.example.demo.repository.SubscriptionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/subscriptions")
public class AdminSubscriptionController {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    public AdminSubscriptionController(SubscriptionRepository subscriptionRepository, UserRepository userRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getAllSubscriptions() {
        List<Subscription> subs = subscriptionRepository.findAll();
        List<User> users = userRepository.findAll();
        Map<String, User> userMap = users.stream().collect(Collectors.toMap(User::getId, u -> u));

        return subs.stream().map(sub -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", sub.getId());
            map.put("userId", sub.getUserId());
            map.put("type", sub.getType());
            map.put("status", sub.getStatus());
            map.put("startDate", sub.getStartDate());
            map.put("endDate", sub.getEndDate());
            map.put("billingCycle", sub.getBillingCycle());
            map.put("createdAt", sub.getCreatedAt());

            User user = userMap.get(sub.getUserId());
            if (user != null) {
                Map<String, String> userInfo = new HashMap<>();
                userInfo.put("name", user.getName());
                userInfo.put("email", user.getEmail());
                map.put("user", userInfo);
            }
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/user/{userId}")
    public List<Subscription> getSubscriptionsByUserId(@PathVariable String userId) {
        return subscriptionRepository.findByUserId(userId);
    }

    @PatchMapping("/{id}")
    public Subscription updateSubscription(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Subscription sub = subscriptionRepository.findById(id).orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        if (updates.containsKey("status")) sub.setStatus(com.example.demo.model.SubscriptionStatus.valueOf(updates.get("status").toString()));
        if (updates.containsKey("type")) sub.setType(com.example.demo.model.SubscriptionType.valueOf(updates.get("type").toString()));
        if (updates.containsKey("endDate")) sub.setEndDate(java.time.LocalDateTime.parse(updates.get("endDate").toString()));
        
        return subscriptionRepository.save(sub);
    }
}
