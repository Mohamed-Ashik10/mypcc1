package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "Hymn")
public class Hymn {

    @Id
    @Column(length = 30)
    private String id;

    @Column(unique = true, nullable = false)
    private Integer number;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String lyrics;

    private String author;
    private String tags;

    @Column(name = "tuneUrl")
    private String tuneUrl;

    @CreationTimestamp
    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    public Hymn() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Integer getNumber() { return number; }
    public void setNumber(Integer number) { this.number = number; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getLyrics() { return lyrics; }
    public void setLyrics(String lyrics) { this.lyrics = lyrics; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    public String getTuneUrl() { return tuneUrl; }
    public void setTuneUrl(String tuneUrl) { this.tuneUrl = tuneUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
