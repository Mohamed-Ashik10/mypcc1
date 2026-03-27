package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.model.TransactionStatus;
import com.example.demo.model.PaymentMethod;
import com.example.demo.model.Subscription;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.SubscriptionRepository;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/financials")
public class FinancialReportingController {

    private final TransactionRepository transactionRepository;
    private final SubscriptionRepository subscriptionRepository;

    public FinancialReportingController(TransactionRepository transactionRepository, SubscriptionRepository subscriptionRepository) {
        this.transactionRepository = transactionRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    /**
     * Get a complete Financial Summary For Administrative Reporting.
     */
    @GetMapping("/summary")
    public Map<String, Object> getFinancialSummary() {
        List<Transaction> allTransactions = transactionRepository.findAll();
        
        double totalRevenue = allTransactions.stream()
                .filter(t -> t.getStatus() == TransactionStatus.COMPLETED)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double pendingRevenue = allTransactions.stream()
                .filter(t -> t.getStatus() == TransactionStatus.PENDING)
                .mapToDouble(Transaction::getAmount)
                .sum();

        long activeSubscriptions = subscriptionRepository.count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRevenueXAF", totalRevenue);
        summary.put("pendingRevenueXAF", pendingRevenue);
        summary.put("totalTransactionsCount", (long) allTransactions.size());
        summary.put("completedTransactionsCount", (long) allTransactions.stream().filter(t -> t.getStatus() == TransactionStatus.COMPLETED).count());
        summary.put("activeSubscriptionsCount", activeSubscriptions);
        summary.put("currency", "XAF");

        return summary;
    }

    /**
     * Get Detailed Financial Statistics & Growth Trends.
     */
    @GetMapping("/stats")
    public Map<String, Object> getFinancialStats() {
        List<Transaction> completed = transactionRepository.findAll().stream()
                .filter(t -> t.getStatus() == TransactionStatus.COMPLETED)
                .collect(Collectors.toList());

        // 1. Monthly Revenue Growth
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
        Map<String, Double> monthlyGrowth = completed.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getCreatedAt().format(monthFormatter),
                        LinkedHashMap::new, // Keep insertion order
                        Collectors.summingDouble(Transaction::getAmount)
                ));

        // 2. Payment Method Breakdown (Count)
        Map<PaymentMethod, Long> paymentBreakdown = completed.stream()
                .collect(Collectors.groupingBy(Transaction::getPaymentMethod, Collectors.counting()));

        // 3. Subscription Type Breakdown
        List<Subscription> subs = subscriptionRepository.findAll();
        Map<String, Long> subTypeBreakdown = subs.stream()
                .collect(Collectors.groupingBy(s -> s.getType().name(), Collectors.counting()));

        Map<String, Object> stats = new HashMap<>();
        stats.put("monthlyGrowthTrend", monthlyGrowth);
        stats.put("paymentMethodUsage", paymentBreakdown);
        stats.put("subscriptionTiers", subTypeBreakdown);
        stats.put("totalFinancialCheck", (long) completed.size() + " completed entries audited.");

        return stats;
    }

    @GetMapping("/transactions")
    public List<Transaction> getTransactions(@RequestParam(required = false) TransactionStatus status) {
        if (status != null) {
            return transactionRepository.findAll().stream()
                    .filter(t -> t.getStatus() == status)
                    .collect(Collectors.toList());
        }
        return transactionRepository.findAll();
    }
}
