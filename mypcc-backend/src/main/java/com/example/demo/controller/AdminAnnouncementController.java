package com.example.demo.controller;

import com.example.demo.model.Announcement;
import com.example.demo.repository.AnnouncementRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/announcements")
public class AdminAnnouncementController {

    private final AnnouncementRepository announcementRepository;

    public AdminAnnouncementController(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    @GetMapping
    public List<Announcement> getAllAnnouncements(
            @RequestParam(required = false) Boolean activeOnly) {
        if (activeOnly != null && activeOnly) {
            return announcementRepository.findByIsActiveTrue();
        }
        return announcementRepository.findAll();
    }

    @PostMapping
    public Announcement createAnnouncement(@RequestBody Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    @GetMapping("/{id}")
    public Announcement getAnnouncementById(@PathVariable String id) {
        return announcementRepository.findById(id).orElse(null);
    }

    @PatchMapping("/{id}")
    public Announcement updateAnnouncement(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Announcement a = announcementRepository.findById(id).orElseThrow(() -> new RuntimeException("Announcement not found"));
        
        if (updates.containsKey("title")) a.setTitle(updates.get("title").toString());
        if (updates.containsKey("content")) a.setContent(updates.get("content").toString());
        if (updates.containsKey("isActive")) a.setIsActive(Boolean.valueOf(updates.get("isActive").toString()));
        
        return announcementRepository.save(a);
    }

    @DeleteMapping("/{id}")
    public void deleteAnnouncement(@PathVariable String id) {
        announcementRepository.deleteById(id);
    }
}
