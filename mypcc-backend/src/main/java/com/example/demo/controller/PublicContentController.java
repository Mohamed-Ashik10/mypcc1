package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
public class PublicContentController {

    private final HymnRepository hymnRepository;
    private final DevotionalRepository devotionalRepository;
    private final TheEchoRepository theEchoRepository;
    private final AnnouncementRepository announcementRepository;
    private final TestimonialRepository testimonialRepository;
    private final DiaryRepository diaryRepository;
    private final AppSettingRepository appSettingRepository;

    public PublicContentController(HymnRepository hymnRepository,
                                   DevotionalRepository devotionalRepository,
                                   TheEchoRepository theEchoRepository,
                                   AnnouncementRepository announcementRepository,
                                   TestimonialRepository testimonialRepository,
                                   DiaryRepository diaryRepository,
                                   AppSettingRepository appSettingRepository) {
        this.hymnRepository = hymnRepository;
        this.devotionalRepository = devotionalRepository;
        this.theEchoRepository = theEchoRepository;
        this.announcementRepository = announcementRepository;
        this.testimonialRepository = testimonialRepository;
        this.diaryRepository = diaryRepository;
        this.appSettingRepository = appSettingRepository;
    }

    @GetMapping("/hymns")
    public List<Hymn> getHymns(@RequestParam(defaultValue = "2000") int limit) {
        return hymnRepository.findAllByOrderByNumberAsc(PageRequest.of(0, limit));
    }

    @GetMapping("/echo")
    public List<TheEchoIssue> getEchoIssues(@RequestParam(defaultValue = "100") int limit) {
        return theEchoRepository.findAllByOrderByIssueMonthDesc(PageRequest.of(0, limit));
    }

    @GetMapping("/devotionals")
    public List<Devotional> getDevotionals(@RequestParam(defaultValue = "8") int limit) {
        return devotionalRepository.findByDateLessThanEqualOrderByDateDesc(LocalDateTime.now(), PageRequest.of(0, limit));
    }

    @GetMapping("/announcements")
    public List<Announcement> getAnnouncements(@RequestParam(defaultValue = "3") int limit) {
        return announcementRepository.findByIsActiveTrueOrderByCreatedAtDesc(PageRequest.of(0, limit));
    }

    @GetMapping("/testimonials")
    public List<Testimonial> getTestimonials(@RequestParam(defaultValue = "3") int limit) {
        return testimonialRepository.findByIsActiveTrueOrderByCreatedAtDesc(PageRequest.of(0, limit));
    }

    @GetMapping("/diary")
    public List<DiaryEntry> getPublicDiary(@RequestParam(defaultValue = "30") int limit) {
        return diaryRepository.findByUserIdIsNullOrderByDateDesc(PageRequest.of(0, limit));
    }

    @GetMapping("/settings")
    public Map<String, String> getSettings() {
        List<AppSetting> settings = appSettingRepository.findAll();
        Set<String> publicKeys = Set.of("app_name", "logo_app", "contact_email", "footer_desc", "theme_preset", "logo_admin");
        
        return settings.stream()
                .filter(s -> publicKeys.contains(s.getKey()))
                .collect(Collectors.toMap(AppSetting::getKey, AppSetting::getValue, (v1, v2) -> v1));
    }
}
