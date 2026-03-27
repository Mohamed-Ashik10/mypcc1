package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "AppSetting")
public class AppSetting {

    @Id
    @Column(length = 30)
    private String id;

    @Column(name = "`key`", unique = true, nullable = false)
    private String key;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String value;

    @UpdateTimestamp
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    public AppSetting() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}
