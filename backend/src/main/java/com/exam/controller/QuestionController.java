package com.exam.controller;

import com.exam.entity.Question;
import com.exam.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    // POST /api/questions - Add a single question manually
    @PostMapping
    public ResponseEntity<Question> addQuestion(@RequestBody Question question) {
        return ResponseEntity.ok(questionService.addQuestion(question));
    }

    // GET /api/questions/exam/{examId} - Get all questions for an exam
    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<Question>> getQuestionsByExam(@PathVariable Long examId) {
        return ResponseEntity.ok(questionService.getQuestionsByExam(examId));
    }

    // PUT /api/questions/{id} - Update a question
    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        return ResponseEntity.ok(questionService.updateQuestion(id, question));
    }

    // DELETE /api/questions/{id} - Delete a question
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok("Question deleted successfully!");
    }

    // POST /api/questions/upload/{examId} - Upload questions from Word (.docx) file
    @PostMapping("/upload/{examId}")
    public ResponseEntity<?> uploadFromWord(@PathVariable Long examId,
                                            @RequestParam("file") MultipartFile file) {
        try {
            List<Question> questions = questionService.uploadQuestionsFromWord(examId, file);
            Map<String, Object> response = new HashMap<>();
            response.put("message", questions.size() + " questions uploaded successfully!");
            response.put("count", questions.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to upload: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
