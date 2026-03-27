package com.example.demo.repository;

import com.example.demo.model.Devotional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DevotionalRepository extends JpaRepository<Devotional, String> {
    List<Devotional> findByTitleContainingIgnoreCase(String title);
    
    @org.springframework.data.jpa.repository.Query("SELECT d FROM Devotional d WHERE " +
           "LOWER(d.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.content) LIKE LOWER(CONCAT('%', :search, '%'))")
    org.springframework.data.domain.Page<Devotional> searchDevotionals(@org.springframework.data.repository.query.Param("search") String search, 
                               org.springframework.data.domain.Pageable pageable);
                               
    java.util.List<Devotional> findByDateLessThanEqualOrderByDateDesc(java.time.LocalDateTime date, org.springframework.data.domain.Pageable pageable);
}
