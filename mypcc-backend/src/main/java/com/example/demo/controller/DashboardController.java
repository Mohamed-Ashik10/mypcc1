package com.example.demo.controller;

import com.example.demo.repository.UserRepository;
import com.example.demo.repository.HymnRepository;
import com.example.demo.repository.DiaryRepository;
import com.example.demo.repository.SubscriptionRepository;
import com.example.demo.repository.TransactionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    private final UserRepository userRepository;
    private final HymnRepository hymnRepository;
    private final DiaryRepository diaryRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final TransactionRepository transactionRepository;

    // Thread pool for parallel DB queries
    private static final ExecutorService STATS_EXECUTOR = Executors.newFixedThreadPool(5);

    public DashboardController(UserRepository userRepository,
                               HymnRepository hymnRepository,
                               DiaryRepository diaryRepository,
                               SubscriptionRepository subscriptionRepository,
                               TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.hymnRepository = hymnRepository;
        this.diaryRepository = diaryRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.transactionRepository = transactionRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        // Launch all 5 DB queries IN PARALLEL — total time = slowest query, not sum
        CompletableFuture<Long> usersFuture = CompletableFuture.supplyAsync(
                () -> userRepository.count(), STATS_EXECUTOR);
        CompletableFuture<Long> hymnsFuture = CompletableFuture.supplyAsync(
                () -> hymnRepository.count(), STATS_EXECUTOR);
        CompletableFuture<Long> diaryFuture = CompletableFuture.supplyAsync(
                () -> diaryRepository.count(), STATS_EXECUTOR);
        CompletableFuture<Long> subsFuture = CompletableFuture.supplyAsync(
                () -> subscriptionRepository.count(), STATS_EXECUTOR);
        CompletableFuture<Double> revenueFuture = CompletableFuture.supplyAsync(
                () -> {
                    Double r = transactionRepository.sumCompletedTransactions();
                    return r == null ? 0.0 : r;
                }, STATS_EXECUTOR);

        // Wait for all to complete
        CompletableFuture.allOf(usersFuture, hymnsFuture, diaryFuture, subsFuture, revenueFuture).join();

        Map<String, Object> stats = new HashMap<>();
        try {
            stats.put("users", usersFuture.get());
            stats.put("hymns", hymnsFuture.get());
            stats.put("diaryEntries", diaryFuture.get());
            stats.put("subscriptions", subsFuture.get());
            stats.put("totalRevenue", revenueFuture.get());
        } catch (Exception e) {
            stats.put("error", e.getMessage());
        }

        return stats;
    }
}
