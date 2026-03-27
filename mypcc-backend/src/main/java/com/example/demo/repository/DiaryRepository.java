package com.example.demo.repository;

import com.example.demo.model.DiaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaryRepository extends JpaRepository<DiaryEntry, String> {
    List<DiaryEntry> findByUserId(String userId);
    long countByUserId(String userId);
    long countByUserIdIsNull();

    @org.springframework.data.jpa.repository.Query("SELECT d FROM DiaryEntry d WHERE " +
           "(LOWER(d.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.theme) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.id) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:year IS NULL OR YEAR(d.date) = :year) AND " +
           "(:month IS NULL OR MONTH(d.date) = :month) AND " +
           "(:userId IS NULL OR d.userId = :userId)")
    org.springframework.data.domain.Page<DiaryEntry> searchDiaryEntries(@org.springframework.data.repository.query.Param("search") String search,
                                      @org.springframework.data.repository.query.Param("year") Integer year,
                                      @org.springframework.data.repository.query.Param("month") Integer month,
                                      @org.springframework.data.repository.query.Param("userId") String userId,
                                      org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(d) FROM DiaryEntry d WHERE " +
           "d.date >= :start AND d.date < :end")
    long countEntriesInPeriod(@org.springframework.data.repository.query.Param("start") java.time.LocalDateTime start,
                             @org.springframework.data.repository.query.Param("end") java.time.LocalDateTime end);
                             
    List<DiaryEntry> findByUserIdIsNullOrderByDateDesc(org.springframework.data.domain.Pageable pageable);
}
