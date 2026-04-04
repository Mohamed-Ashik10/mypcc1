package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "TheEchoIssue")
public class TheEchoIssue {

    @Id
    @Column(length = 30)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(name = "issueMonth", nullable = false)
    private LocalDateTime issueMonth;

    @Column(name = "pdfUrl", nullable = false)
    private String pdfUrl;

    @Column(name = "coverUrl")
    private String coverUrl;

    @Column(name = "isFree", nullable = false)
    private Boolean isFree = true;

    @Column(nullable = false)
    private String author = "Admin";

    @Column(nullable = false)
    private String category = "news";

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @Column(name = "fullText", columnDefinition = "TEXT")
    private String fullText;

    @Column(name = "isFeatured", nullable = false)
    private Boolean isFeatured = false;

    @Column(columnDefinition = "TEXT")
    private String images;

    @CreationTimestamp
    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    public TheEchoIssue() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
    public LocalDateTime getIssueMonth() { return issueMonth; }
    public void setIssueMonth(LocalDateTime issueMonth) { this.issueMonth = issueMonth; }
    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }
    public Boolean getIsFree() { return isFree; }
    public void setIsFree(Boolean isFree) { this.isFree = isFree; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }
    public String getFullText() { return fullText; }
    public void setFullText(String fullText) { this.fullText = fullText; }
    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }
    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
