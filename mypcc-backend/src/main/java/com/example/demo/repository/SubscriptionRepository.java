package com.example.demo.repository;

import com.example.demo.model.Subscription;
import com.example.demo.model.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, String> {
    List<Subscription> findByStatus(SubscriptionStatus status);
    List<Subscription> findByUserId(String userId);
    java.util.Optional<Subscription> findFirstByUserIdAndStatusOrderByEndDateDesc(String userId, com.example.demo.model.SubscriptionStatus status);
}
