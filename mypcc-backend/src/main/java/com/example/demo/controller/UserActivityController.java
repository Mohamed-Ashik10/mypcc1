package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/public/user-activity")
public class UserActivityController {

    private final DiaryRepository diaryRepository;
    private final HymnFavouriteRepository favoriteRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final TransactionRepository transactionRepository;

    public UserActivityController(DiaryRepository diaryRepository,
                                  HymnFavouriteRepository favoriteRepository,
                                  SubscriptionRepository subscriptionRepository,
                                  TransactionRepository transactionRepository) {
        this.diaryRepository = diaryRepository;
        this.favoriteRepository = favoriteRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.transactionRepository = transactionRepository;
    }

    // --- FAVORITES ---
    @GetMapping("/favorites/{userId}")
    public List<HymnFavourite> getFavorites(@PathVariable String userId) {
        return favoriteRepository.findByUserId(userId);
    }

    @PostMapping("/favorites/toggle")
    @Transactional
    public ResponseEntity<?> toggleFavorite(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String hymnId = body.get("hymnId");

        if (userId == null || hymnId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing userId or hymnId"));
        }

        Optional<HymnFavourite> existing = favoriteRepository.findByUserIdAndHymnId(userId, hymnId);
        if (existing.isPresent()) {
            favoriteRepository.deleteByUserIdAndHymnId(userId, hymnId);
            return ResponseEntity.ok(Map.of("message", "Removed from favorites", "action", "removed"));
        } else {
            try {
                String favId = "fav_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 5);
                HymnFavourite fav = new HymnFavourite(favId, userId, hymnId);
                favoriteRepository.save(fav);
                return ResponseEntity.status(201).body(Map.of("message", "Added to favorites", "action", "added"));
            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                // Duplicate key — another concurrent request already added it. Treat as success.
                return ResponseEntity.ok(Map.of("message", "Already in favorites", "action", "added"));
            }
        }
    }

    // --- PERSONAL DIARY ---
    @PostMapping("/diary")
    public ResponseEntity<?> createPersonalDiaryEntry(@RequestBody DiaryEntry entry) {
        if (entry.getUserId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Personal entries must have a userId"));
        }

        // 1. Check Subscription for limits
        Optional<Subscription> activeSub = subscriptionRepository.findFirstByUserIdAndStatusOrderByEndDateDesc(
                entry.getUserId(), SubscriptionStatus.ACTIVE);

        int limit = 5;
        String planName = "Free";
        if (activeSub.isPresent()) {
            SubscriptionType type = activeSub.get().getType();
            if (type == SubscriptionType.SEEKER) { limit = 20; planName = "Seeker"; }
            else if (type == SubscriptionType.PILGRIM) { limit = 100; planName = "Pilgrim"; }
            else if (type == SubscriptionType.SHEPHERD) { limit = 10000; planName = "Shepherd"; }
        }

        long currentCount = diaryRepository.countByUserId(entry.getUserId());
        if (currentCount >= limit) {
            return ResponseEntity.status(403).body(Map.of(
                    "error", String.format("Limit reached! Your current %s plan only allows up to %s entries.", planName, limit == 10000 ? "unlimited" : limit),
                    "code", "LIMIT_REACHED",
                    "limit", limit,
                    "currentCount", currentCount
            ));
        }

        // 2. Save entry
        if (entry.getId() == null) entry.setId("entry_" + UUID.randomUUID().toString().substring(0, 10));
        if (entry.getDate() == null) entry.setDate(LocalDateTime.now());
        
        DiaryEntry saved = diaryRepository.save(entry);
        return ResponseEntity.status(201).body(saved);
    }

    // --- PAYMENTS & SUBSCRIPTIONS ---
    @PostMapping("/payments/complete")
    @Transactional
    public ResponseEntity<?> completePayment(@RequestBody Map<String, Object> body) {
        try {
            String userId = (String) body.get("userId");
            String planTypeStr = (String) body.get("planType");
            String amountStr = body.get("amount").toString();
            String paymentMethodStr = (String) body.get("paymentMethod");

            if (userId == null || planTypeStr == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }

            // 1. Create Transaction
            String reference = "PCC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            Transaction transaction = new Transaction();
            transaction.setId("tx_" + UUID.randomUUID().toString().substring(0, 10));
            transaction.setUserId(userId);
            transaction.setAmount(Double.parseDouble(amountStr));
            transaction.setCurrency("XAF");
            transaction.setPaymentMethod(PaymentMethod.valueOf(paymentMethodStr));
            transaction.setStatus(TransactionStatus.COMPLETED);
            transaction.setReference(reference);
            transactionRepository.save(transaction);

            // 2. Deactivate existing active subscriptions
            List<Subscription> activeSubs = subscriptionRepository.findByUserId(userId);
            for (Subscription sub : activeSubs) {
                if (sub.getStatus() == SubscriptionStatus.ACTIVE) {
                    sub.setStatus(SubscriptionStatus.EXPIRED);
                    subscriptionRepository.save(sub);
                }
            }

            // 3. Create new Subscription
            SubscriptionType planType = SubscriptionType.valueOf(planTypeStr);
            LocalDateTime startDate = LocalDateTime.now();
            LocalDateTime endDate = startDate.plusDays(30); // Default MONTHLY
            if (body.containsKey("billingCycle") && body.get("billingCycle").equals("ANNUAL")) {
                endDate = startDate.plusDays(365);
            }

            Subscription subscription = new Subscription();
            subscription.setId("sub_" + UUID.randomUUID().toString().substring(0, 10));
            subscription.setUserId(userId);
            subscription.setType(planType);
            subscription.setStatus(SubscriptionStatus.ACTIVE);
            subscription.setStartDate(startDate);
            subscription.setEndDate(endDate);
            subscriptionRepository.save(subscription);

            return ResponseEntity.ok(Map.of("success", true, "transaction", transaction, "subscription", subscription));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
