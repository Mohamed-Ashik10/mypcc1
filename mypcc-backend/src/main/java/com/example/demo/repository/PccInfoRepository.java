package com.example.demo.repository;

import com.example.demo.model.PccInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PccInfoRepository extends JpaRepository<PccInfo, String> {
    List<PccInfo> findAllByOrderBySectionAsc();
}
