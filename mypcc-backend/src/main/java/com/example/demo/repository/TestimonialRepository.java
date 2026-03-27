package com.example.demo.repository;

import com.example.demo.model.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, String> {
    List<Testimonial> findByIsActiveTrue();
    List<Testimonial> findByIsActiveTrueOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);
}
