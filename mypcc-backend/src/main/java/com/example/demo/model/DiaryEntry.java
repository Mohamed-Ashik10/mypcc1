package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "DiaryEntry")
public class DiaryEntry {

    @Id
    @Column(length = 30)
    private String id;

    @Column(nullable = false)
    private LocalDateTime date;

    private String title;
    
    @Column(name = "readingOne")
    private String readingOne;
    
    @Column(name = "readingTwo")
    private String readingTwo;
    
    @Column(name = "readingThree")
    private String readingThree;
    
    private String theme;

    @Column(columnDefinition = "TEXT")
    private String body;

    private String hymn;

    @Column(name = "userId")
    private String userId;

    @CreationTimestamp
    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    public DiaryEntry() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getReadingOne() { return readingOne; }
    public void setReadingOne(String readingOne) { this.readingOne = readingOne; }
    public String getReadingTwo() { return readingTwo; }
    public void setReadingTwo(String readingTwo) { this.readingTwo = readingTwo; }
    public String getReadingThree() { return readingThree; }
    public void setReadingThree(String readingThree) { this.readingThree = readingThree; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getHymn() { return hymn; }
    public void setHymn(String hymn) { this.hymn = hymn; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
