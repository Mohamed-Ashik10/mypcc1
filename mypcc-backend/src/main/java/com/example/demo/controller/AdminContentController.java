package com.example.demo.controller;

import com.example.demo.model.Hymn;
import com.example.demo.model.Devotional;
import com.example.demo.model.TheEchoIssue;
import com.example.demo.repository.HymnRepository;
import com.example.demo.repository.DevotionalRepository;
import com.example.demo.repository.TheEchoRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/content")
public class AdminContentController {

    private final HymnRepository hymnRepository;
    private final DevotionalRepository devotionalRepository;
    private final TheEchoRepository theEchoRepository;

    public AdminContentController(HymnRepository hymnRepository, 
                                  DevotionalRepository devotionalRepository,
                                  TheEchoRepository theEchoRepository) {
        this.hymnRepository = hymnRepository;
        this.devotionalRepository = devotionalRepository;
        this.theEchoRepository = theEchoRepository;
    }

    // --- HYMNS ---
    @GetMapping("/hymns")
    public Map<String, Object> getAllHymns(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int limit) {
        
        org.springframework.data.domain.PageRequest pageRequest = org.springframework.data.domain.PageRequest.of(page - 1, limit);
        org.springframework.data.domain.Page<Hymn> hymnPage;

        if ((search != null && !search.isEmpty()) || (tag != null && !tag.isEmpty())) {
            hymnPage = hymnRepository.searchHymns(search != null ? search : "", tag, pageRequest);
        } else {
            hymnPage = hymnRepository.findAll(pageRequest);
        }

        // OPTIMIZED: Only fetch tags, not full hymn objects
        List<String> allTags = hymnRepository.findOnlyTags();
        Set<String> uniqueTags = allTags.stream()
                .filter(t -> t != null)
                .flatMap(t -> java.util.Arrays.stream(t.split(",")))
                .map(String::trim)
                .filter(tagItem -> !tagItem.isEmpty())
                .collect(java.util.stream.Collectors.toSet());

        Map<String, Object> response = new HashMap<>();
        response.put("hymns", hymnPage.getContent());
        response.put("total", hymnPage.getTotalElements());
        response.put("uniqueTags", uniqueTags);
        
        return response;
    }

    @GetMapping("/hymns/{id}")
    public Hymn getHymnById(@PathVariable String id) {
        return hymnRepository.findById(id).orElse(null);
    }

    @PostMapping("/hymns")
    public Hymn createHymn(@RequestBody Hymn hymn) {
        return hymnRepository.save(hymn);
    }

    @PatchMapping("/hymns/{id}")
    public Hymn updateHymn(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Hymn hymn = hymnRepository.findById(id).orElseThrow(() -> new RuntimeException("Hymn not found"));
        
        if (updates.containsKey("number")) hymn.setNumber(Integer.parseInt(updates.get("number").toString()));
        if (updates.containsKey("title")) hymn.setTitle(updates.get("title").toString());
        if (updates.containsKey("lyrics")) hymn.setLyrics(updates.get("lyrics").toString());
        if (updates.containsKey("author")) hymn.setAuthor(updates.get("author") != null ? updates.get("author").toString() : null);
        if (updates.containsKey("tags")) hymn.setTags(updates.get("tags") != null ? updates.get("tags").toString() : null);
        if (updates.containsKey("tuneUrl")) hymn.setTuneUrl(updates.get("tuneUrl") != null ? updates.get("tuneUrl").toString() : null);
        
        return hymnRepository.save(hymn);
    }

    @DeleteMapping("/hymns/{id}")
    public void deleteHymn(@PathVariable String id) {
        hymnRepository.deleteById(id);
    }

    // --- DEVOTIONALS ---
    @GetMapping("/devotionals")
    public Map<String, Object> getAllDevotionals(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int limit) {
        
        org.springframework.data.domain.PageRequest pageRequest = org.springframework.data.domain.PageRequest.of(page - 1, limit);
        org.springframework.data.domain.Page<Devotional> devotionalPage;

        if (search != null && !search.isEmpty()) {
            devotionalPage = devotionalRepository.searchDevotionals(search, pageRequest);
        } else {
            devotionalPage = devotionalRepository.findAll(pageRequest);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("devotionals", devotionalPage.getContent());
        response.put("total", devotionalPage.getTotalElements());
        
        return response;
    }

    @GetMapping("/devotionals/{id}")
    public Devotional getDevotionalById(@PathVariable String id) {
        return devotionalRepository.findById(id).orElse(null);
    }

    @PostMapping("/devotionals")
    public Devotional createDevotional(@RequestBody Devotional devotional) {
        return devotionalRepository.save(devotional);
    }

    @PatchMapping("/devotionals/{id}")
    public Devotional updateDevotional(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Devotional d = devotionalRepository.findById(id).orElseThrow(() -> new RuntimeException("Devotional not found"));
        
        if (updates.containsKey("title")) d.setTitle(updates.get("title").toString());
        if (updates.containsKey("content")) d.setContent(updates.get("content").toString());
        if (updates.containsKey("excerpt")) d.setExcerpt(updates.get("excerpt") != null ? updates.get("excerpt").toString() : null);
        if (updates.containsKey("author")) d.setAuthor(updates.get("author") != null ? updates.get("author").toString() : null);
        if (updates.containsKey("reading")) d.setReading(updates.get("reading") != null ? updates.get("reading").toString() : null);
        if (updates.containsKey("category")) d.setCategory(updates.get("category") != null ? updates.get("category").toString() : null);
        if (updates.containsKey("image")) d.setImage(updates.get("image") != null ? updates.get("image").toString() : null);
        if (updates.containsKey("date")) d.setDate(java.time.LocalDateTime.parse(updates.get("date").toString()));
        if (updates.containsKey("isFree")) d.setIsFree(Boolean.valueOf(updates.get("isFree").toString()));
        if (updates.containsKey("minPlan") && updates.get("minPlan") != null) {
            d.setMinPlan(com.example.demo.model.SubscriptionType.valueOf(updates.get("minPlan").toString()));
        }
        
        return devotionalRepository.save(d);
    }

    @DeleteMapping("/devotionals/{id}")
    public void deleteDevotional(@PathVariable String id) {
        devotionalRepository.deleteById(id);
    }

    // --- THE ECHO (NEWS) ---
    @GetMapping("/echo")
    public Map<String, Object> getAllEchoIssues(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int limit) {
        
        org.springframework.data.domain.PageRequest pageRequest = org.springframework.data.domain.PageRequest.of(page - 1, limit);
        org.springframework.data.domain.Page<TheEchoIssue> issuePage;

        if ((search != null && !search.isEmpty()) || year != null || month != null) {
            issuePage = theEchoRepository.searchEchoIssues(search != null ? search : "", year, month, pageRequest);
        } else {
            issuePage = theEchoRepository.findAll(pageRequest);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("list", issuePage.getContent());
        response.put("total", issuePage.getTotalElements());
        
        return response;
    }

    @GetMapping("/echo/{id}")
    public TheEchoIssue getEchoIssueById(@PathVariable String id) {
        return theEchoRepository.findById(id).orElse(null);
    }

    @PostMapping("/echo")
    public TheEchoIssue createEchoIssue(@RequestBody TheEchoIssue issue) {
        return theEchoRepository.save(issue);
    }

    @PatchMapping("/echo/{id}")
    public TheEchoIssue updateEchoIssue(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        TheEchoIssue i = theEchoRepository.findById(id).orElseThrow(() -> new RuntimeException("Echo issue not found"));
        
        if (updates.containsKey("title")) i.setTitle(updates.get("title").toString());
        if (updates.containsKey("excerpt")) i.setExcerpt(updates.get("excerpt") != null ? updates.get("excerpt").toString() : null);
        if (updates.containsKey("fullText")) i.setFullText(updates.get("fullText") != null ? updates.get("fullText").toString() : null);
        if (updates.containsKey("author")) i.setAuthor(updates.get("author") != null ? updates.get("author").toString() : null);
        if (updates.containsKey("category")) i.setCategory(updates.get("category") != null ? updates.get("category").toString() : null);
        if (updates.containsKey("pdfUrl")) i.setPdfUrl(updates.get("pdfUrl") != null ? updates.get("pdfUrl").toString() : null);
        if (updates.containsKey("coverUrl")) i.setCoverUrl(updates.get("coverUrl") != null ? updates.get("coverUrl").toString() : null);
        if (updates.containsKey("images")) i.setImages(updates.get("images") != null ? updates.get("images").toString() : null);
        if (updates.containsKey("issueMonth")) i.setIssueMonth(java.time.LocalDateTime.parse(updates.get("issueMonth").toString()));
        if (updates.containsKey("isFree")) i.setIsFree(Boolean.parseBoolean(updates.get("isFree").toString()));
        if (updates.containsKey("isFeatured")) i.setIsFeatured(Boolean.parseBoolean(updates.get("isFeatured").toString()));
        
        return theEchoRepository.save(i);
    }

    @DeleteMapping("/echo/{id}")
    public void deleteEchoIssue(@PathVariable String id) {
        theEchoRepository.deleteById(id);
    }
}
