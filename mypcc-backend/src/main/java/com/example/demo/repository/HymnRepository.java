package com.example.demo.repository;

import com.example.demo.model.Hymn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HymnRepository extends JpaRepository<Hymn, String> {
    List<Hymn> findByTitleContainingIgnoreCaseOrLyricsContainingIgnoreCase(String title, String lyrics);
    Hymn findByNumber(Integer number);
    List<Hymn> findByTagsContainingIgnoreCase(String tag);
    
    @org.springframework.data.jpa.repository.Query("SELECT h FROM Hymn h WHERE " +
           "(LOWER(h.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "CAST(h.number as string) LIKE CONCAT('%', :search, '%') OR " +
           "LOWER(h.id) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:tag IS NULL OR LOWER(h.tags) LIKE LOWER(CONCAT('%', :tag, '%')))")
    org.springframework.data.domain.Page<Hymn> searchHymns(@org.springframework.data.repository.query.Param("search") String search, 
                          @org.springframework.data.repository.query.Param("tag") String tag,
                          org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT h.tags FROM Hymn h WHERE h.tags IS NOT NULL")
    List<String> findOnlyTags();
    
    java.util.List<Hymn> findAllByOrderByNumberAsc(org.springframework.data.domain.Pageable pageable);
}
