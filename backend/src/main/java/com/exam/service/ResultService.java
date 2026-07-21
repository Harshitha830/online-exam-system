package com.exam.service;

import com.exam.dto.SubmitExamRequest;
import com.exam.entity.Exam;
import com.exam.entity.Question;
import com.exam.entity.Result;
import com.exam.repository.ExamRepository;
import com.exam.repository.QuestionRepository;
import com.exam.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamRepository examRepository;

    // Check if student already attempted this exam
    public boolean alreadyAttempted(String studentEmail, String examName) {
        return resultRepository.existsByStudentEmailAndExamName(studentEmail, examName);
    }

    // Calculate score and save result
    public Result submitExam(SubmitExamRequest request) {
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        // Check if already attempted
        if (alreadyAttempted(request.getStudentEmail(), exam.getExamName())) {
            throw new RuntimeException("You have already completed this exam!");
        }

        List<Question> questions = questionRepository.findByExamId(request.getExamId());
        Map<Long, String> answers = request.getAnswers();

        int score = 0;

        // Compare each submitted answer with the correct answer
        for (Question q : questions) {
            String submitted = answers.get(q.getId());
            if (submitted != null && submitted.equalsIgnoreCase(q.getCorrectAnswer())) {
                score += q.getMarks();
            }
        }

        // Calculate percentage based on exam total marks
        double percentage = exam.getTotalMarks() > 0
                ? ((double) score / exam.getTotalMarks()) * 100
                : 0;

        // Pass if percentage >= 40%
        String status = percentage >= 40 ? "Pass" : "Fail";

        Result result = new Result(
                request.getStudentEmail(),
                request.getStudentName(),
                exam.getExamName(),
                score,
                exam.getTotalMarks(),
                Math.round(percentage * 100.0) / 100.0,
                status
        );

        return resultRepository.save(result);
    }

    // Get all results (for admin dashboard)
    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }

    // Get results for a specific student
    public List<Result> getResultsByStudent(String studentEmail) {
        return resultRepository.findByStudentEmail(studentEmail);
    }
}
