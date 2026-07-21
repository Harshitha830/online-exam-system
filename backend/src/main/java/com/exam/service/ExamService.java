package com.exam.service;

import com.exam.entity.Exam;
import com.exam.entity.Subject;
import com.exam.repository.ExamRepository;
import com.exam.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    public Exam createExam(Exam exam) {
        return examRepository.save(exam);
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Exam getExamById(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
    }

    public Exam updateExam(Long id, Exam updatedExam) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        exam.setExamName(updatedExam.getExamName());
        exam.setDuration(updatedExam.getDuration());
        exam.setTotalMarks(updatedExam.getTotalMarks());

        // Update subject if provided
        if (updatedExam.getSubject() != null && updatedExam.getSubject().getId() != null) {
            Subject subject = subjectRepository.findById(updatedExam.getSubject().getId())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));
            exam.setSubject(subject);
        }
        return examRepository.save(exam);
    }

    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }

    public long countExams() {
        return examRepository.count();
    }
}
