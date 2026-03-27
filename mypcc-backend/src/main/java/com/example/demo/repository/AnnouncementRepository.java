package com.example.demo.repository;

import com.example.demo.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, String> {
    List<Announcement> findByIsActiveTrue();
    List<Announcement> findByIsActiveTrueOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);
}
