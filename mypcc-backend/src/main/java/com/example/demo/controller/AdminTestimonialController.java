package com.example.demo.controller;

import com.example.demo.model.Testimonial;
import com.example.demo.repository.TestimonialRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/testimonials")
public class AdminTestimonialController {

    private final TestimonialRepository testimonialRepository;

    public AdminTestimonialController(TestimonialRepository testimonialRepository) {
        this.testimonialRepository = testimonialRepository;
    }

    @GetMapping
    public List<Testimonial> getAllTestimonials(
            @RequestParam(required = false) Boolean activeOnly) {
        if (activeOnly != null && activeOnly) {
            return testimonialRepository.findByIsActiveTrue();
        }
        return testimonialRepository.findAll();
    }

    @PostMapping
    public Testimonial createTestimonial(@RequestBody Testimonial testimonial) {
        return testimonialRepository.save(testimonial);
    }

    @GetMapping("/{id}")
    public Testimonial getTestimonialById(@PathVariable String id) {
        return testimonialRepository.findById(id).orElse(null);
    }

    @PatchMapping("/{id}")
    public Testimonial updateTestimonial(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Testimonial t = testimonialRepository.findById(id).orElseThrow(() -> new RuntimeException("Testimonial not found"));
        
        if (updates.containsKey("authorName")) t.setAuthorName(updates.get("authorName").toString());
        if (updates.containsKey("authorRole")) t.setAuthorRole(updates.get("authorRole").toString());
        if (updates.containsKey("content")) t.setContent(updates.get("content").toString());
        if (updates.containsKey("authorImage")) t.setAuthorImage(updates.get("authorImage").toString());
        if (updates.containsKey("isActive")) t.setIsActive(Boolean.valueOf(updates.get("isActive").toString()));
        
        return testimonialRepository.save(t);
    }

    @DeleteMapping("/{id}")
    public void deleteTestimonial(@PathVariable String id) {
        testimonialRepository.deleteById(id);
    }
}
