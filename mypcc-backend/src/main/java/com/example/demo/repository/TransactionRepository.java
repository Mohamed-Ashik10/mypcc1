package com.example.demo.repository;

import com.example.demo.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    
    // Custom query method using Spring Data JPA naming conventions
    Optional<Transaction> findByReference(String reference);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.status = com.example.demo.model.TransactionStatus.COMPLETED")
    Double sumCompletedTransactions();
}
