package com.exam.controller;

import com.exam.dto.SubmitExamRequest;
import com.exam.entity.Result;
import com.exam.service.ExamService;
import com.exam.service.QuestionService;
import com.exam.service.ResultService;
import com.exam.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private ExamService examService;

    @Autowired
    private QuestionService questionService;

    // POST /api/results/submit - Submit exam and get result
    @PostMapping("/submit")
    public ResponseEntity<?> submitExam(@RequestBody SubmitExamRequest request) {
        try {
            Result result = resultService.submitExam(request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // GET /api/results - Get all results (Admin)
    @GetMapping
    public ResponseEntity<List<Result>> getAllResults() {
        return ResponseEntity.ok(resultService.getAllResults());
    }

    // GET /api/results/student/{email} - Get results for a student
    @GetMapping("/student/{email}")
    public ResponseEntity<List<Result>> getStudentResults(@PathVariable String email) {
        return ResponseEntity.ok(resultService.getResultsByStudent(email));
    }

    // GET /api/results/check?email=...&examName=... - Check if already attempted
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkAttempt(
            @RequestParam String email,
            @RequestParam String examName) {
        boolean attempted = resultService.alreadyAttempted(email, examName);
        Map<String, Boolean> response = new HashMap<>();
        response.put("attempted", attempted);
        return ResponseEntity.ok(response);
    }

    // GET /api/results/dashboard - Admin dashboard stats
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSubjects", subjectService.countSubjects());
        stats.put("totalExams", examService.countExams());
        stats.put("totalQuestions", questionService.countAllQuestions());
        stats.put("results", resultService.getAllResults());
        return ResponseEntity.ok(stats);
    }
}
