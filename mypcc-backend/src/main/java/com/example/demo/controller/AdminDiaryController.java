package com.example.demo.controller;

import com.example.demo.model.DiaryEntry;
import com.example.demo.repository.DiaryRepository;
import com.example.demo.service.AuditLogService;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/api/admin/diary")
public class AdminDiaryController {

    private final DiaryRepository diaryRepository;
    private final AuditLogService auditLogService;

    public AdminDiaryController(DiaryRepository diaryRepository, AuditLogService auditLogService) {
        this.diaryRepository = diaryRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public java.util.Map<String, Object> getAllEntries(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int limit) {
        
        org.springframework.data.domain.PageRequest pageRequest = org.springframework.data.domain.PageRequest.of(page - 1, limit, 
                                                                    org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "date"));
        
        org.springframework.data.domain.Page<DiaryEntry> entryPage;
        
        if (userId != null || (search != null && !search.isEmpty()) || year != null || month != null) {
            entryPage = diaryRepository.searchDiaryEntries(search != null ? search : "", year, month, userId, pageRequest);
        } else {
            entryPage = diaryRepository.findAll(pageRequest);
        }

        // Optimized counting using database queries
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        java.time.LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0);
        java.time.LocalDateTime endOfMonth = startOfMonth.plusMonths(1);
        
        long totalAll = diaryRepository.countByUserIdIsNull();
        long monthCount = diaryRepository.countEntriesInPeriod(startOfMonth, endOfMonth);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("entries", entryPage.getContent());
        response.put("total", entryPage.getTotalElements());
        response.put("totalEntries", totalAll);
        response.put("monthEntriesCount", monthCount);
        
        return response;
    }

    @GetMapping("/{id}")
    public DiaryEntry getEntry(@PathVariable String id) {
        return diaryRepository.findById(id).orElse(null);
    }

    @PostMapping
    public DiaryEntry createEntry(@RequestBody DiaryEntry entry, HttpServletRequest request) {
        DiaryEntry saved = diaryRepository.save(entry);
        auditLogService.logAction("SYSTEM", "CREATE_DIARY", "Created diary entry: " + saved.getTitle(), request);
        return saved;
    }

    @PatchMapping("/{id}")
    public DiaryEntry updateEntry(@PathVariable String id, @RequestBody java.util.Map<String, Object> updates, HttpServletRequest request) {
        DiaryEntry e = diaryRepository.findById(id).orElseThrow(() -> new RuntimeException("Diary entry not found"));
        
        if (updates.containsKey("title")) e.setTitle(updates.get("title").toString());
        if (updates.containsKey("date")) e.setDate(java.time.LocalDateTime.parse(updates.get("date").toString()));
        if (updates.containsKey("theme")) e.setTheme(updates.get("theme") != null ? updates.get("theme").toString() : null);
        if (updates.containsKey("readingOne")) e.setReadingOne(updates.get("readingOne") != null ? updates.get("readingOne").toString() : null);
        if (updates.containsKey("readingTwo")) e.setReadingTwo(updates.get("readingTwo") != null ? updates.get("readingTwo").toString() : null);
        if (updates.containsKey("readingThree")) e.setReadingThree(updates.get("readingThree") != null ? updates.get("readingThree").toString() : null);
        
        DiaryEntry updated = diaryRepository.save(e);
        auditLogService.logAction("SYSTEM", "UPDATE_DIARY", "Updated diary entry: " + updated.getTitle(), request);
        return updated;
    }

    @DeleteMapping("/{id}")
    public void deleteEntry(@PathVariable String id, HttpServletRequest request) {
        DiaryEntry d = diaryRepository.findById(id).orElse(null);
        diaryRepository.deleteById(id);
        if (d != null) {
            auditLogService.logAction("SYSTEM", "DELETE_DIARY", "Deleted diary entry: " + d.getTitle(), request);
        }
    }
}
