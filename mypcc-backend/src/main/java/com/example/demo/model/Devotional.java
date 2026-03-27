package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "Devotional")
public class Devotional {

    @Id
    @Column(length = 30)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String author;

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    private String image;
    private String reading;

    @Column(nullable = false)
    private String category = "Inspiration";

    @Column(name = "isFree", nullable = false)
    private Boolean isFree = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "minPlan", nullable = false)
    private SubscriptionType minPlan = SubscriptionType.SEEKER;

    @CreationTimestamp
    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    public Devotional() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getReading() { return reading; }
    public void setReading(String reading) { this.reading = reading; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Boolean getIsFree() { return isFree; }
    public void setIsFree(Boolean isFree) { this.isFree = isFree; }
    public SubscriptionType getMinPlan() { return minPlan; }
    public void setMinPlan(SubscriptionType minPlan) { this.minPlan = minPlan; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
