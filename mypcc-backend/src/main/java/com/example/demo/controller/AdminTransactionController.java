package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.repository.TransactionRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/admin/transactions")
public class AdminTransactionController {

    private final TransactionRepository transactionRepository;

    public AdminTransactionController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        // Equivalent to prisma.transaction.findMany()
        return transactionRepository.findAll();
    }
}
