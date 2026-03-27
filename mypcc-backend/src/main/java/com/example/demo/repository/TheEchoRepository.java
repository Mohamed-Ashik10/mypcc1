package com.example.demo.repository;

import com.example.demo.model.TheEchoIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TheEchoRepository extends JpaRepository<TheEchoIssue, String> {
    @org.springframework.data.jpa.repository.Query("SELECT i FROM TheEchoIssue i WHERE " +
           "(LOWER(i.title) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:year IS NULL OR YEAR(i.issueMonth) = :year) AND " +
           "(:month IS NULL OR MONTH(i.issueMonth) = :month)")
    org.springframework.data.domain.Page<TheEchoIssue> searchEchoIssues(@org.springframework.data.repository.query.Param("search") String search,
                                       @org.springframework.data.repository.query.Param("year") Integer year,
                                       @org.springframework.data.repository.query.Param("month") Integer month,
                                       org.springframework.data.domain.Pageable pageable);
                                       
    java.util.List<TheEchoIssue> findAllByOrderByIssueMonthDesc(org.springframework.data.domain.Pageable pageable);
}
