package com.exam.repository;

import com.exam.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {

    // Get all results for a specific student
    List<Result> findByStudentEmail(String studentEmail);

    // Check if student already attempted this exam (prevent re-attempt)
    boolean existsByStudentEmailAndExamName(String studentEmail, String examName);
}
