package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "HymnFavourite", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"userId", "hymnId"})
})
public class HymnFavourite {

    @Id
    private String id;

    @Column(name = "userId", nullable = false)
    private String userId;

    @Column(name = "hymnId", nullable = false)
    private String hymnId;

    @CreationTimestamp
    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;

    // Default constructor
    public HymnFavourite() {}

    public HymnFavourite(String id, String userId, String hymnId) {
        this.id = id;
        this.userId = userId;
        this.hymnId = hymnId;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getHymnId() { return hymnId; }
    public void setHymnId(String hymnId) { this.hymnId = hymnId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
