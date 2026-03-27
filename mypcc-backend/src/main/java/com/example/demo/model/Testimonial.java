package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "Testimonial")
public class Testimonial {

    @Id
    @Column(length = 30)
    private String id;

    @Column(name = "authorName", nullable = false)
    private String authorName;

    @Column(name = "authorRole")
    private String authorRole;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "authorImage")
    private String authorImage;

    @Column(name = "isActive", nullable = false)
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    public Testimonial() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getAuthorImage() { return authorImage; }
    public void setAuthorImage(String authorImage) { this.authorImage = authorImage; }
    public boolean isIsActive() { return isActive; }
    public void setIsActive(boolean isActive) { this.isActive = isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
