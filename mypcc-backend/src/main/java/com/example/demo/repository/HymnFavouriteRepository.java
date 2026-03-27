package com.example.demo.repository;

import com.example.demo.model.HymnFavourite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HymnFavouriteRepository extends JpaRepository<HymnFavourite, String> {
    List<HymnFavourite> findByUserId(String userId);
    Optional<HymnFavourite> findByUserIdAndHymnId(String userId, String hymnId);
    void deleteByUserIdAndHymnId(String userId, String hymnId);
}
