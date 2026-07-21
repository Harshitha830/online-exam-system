package com.exam.service;

import com.exam.entity.Exam;
import com.exam.entity.Question;
import com.exam.repository.ExamRepository;
import com.exam.repository.QuestionRepository;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamRepository examRepository;

    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    public List<Question> getQuestionsByExam(Long examId) {
        return questionRepository.findByExamId(examId);
    }

    public Question updateQuestion(Long id, Question updated) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        q.setQuestionText(updated.getQuestionText());
        q.setOptionA(updated.getOptionA());
        q.setOptionB(updated.getOptionB());
        q.setOptionC(updated.getOptionC());
        q.setOptionD(updated.getOptionD());
        q.setCorrectAnswer(updated.getCorrectAnswer());
        q.setMarks(updated.getMarks());
        return questionRepository.save(q);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public long countAllQuestions() {
        return questionRepository.count();
    }

    /**
     * Parses a .docx Word file and saves questions to the database.
     *
     * Expected Word document format (repeat for each question):
     *
     * Question: What is Java?
     * A. Programming Language
     * B. Database
     * C. Browser
     * D. Operating System
     * Answer: A
     * Marks: 2
     *
     */
    public List<Question> uploadQuestionsFromWord(Long examId, MultipartFile file) throws Exception {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        List<Question> savedQuestions = new ArrayList<>();

        try (InputStream is = file.getInputStream();
             XWPFDocument document = new XWPFDocument(is)) {

            List<XWPFParagraph> paragraphs = document.getParagraphs();

            Question current = null;

            for (XWPFParagraph para : paragraphs) {
                String line = para.getText().trim();
                if (line.isEmpty()) continue;

                if (line.toLowerCase().startsWith("question:")) {
                    // Save previous question if exists
                    if (current != null) {
                        current.setExam(exam);
                        savedQuestions.add(questionRepository.save(current));
                    }
                    current = new Question();
                    current.setQuestionText(line.substring(9).trim());

                } else if (line.toUpperCase().startsWith("A.") && current != null) {
                    current.setOptionA(line.substring(2).trim());

                } else if (line.toUpperCase().startsWith("B.") && current != null) {
                    current.setOptionB(line.substring(2).trim());

                } else if (line.toUpperCase().startsWith("C.") && current != null) {
                    current.setOptionC(line.substring(2).trim());

                } else if (line.toUpperCase().startsWith("D.") && current != null) {
                    current.setOptionD(line.substring(2).trim());

                } else if (line.toLowerCase().startsWith("answer:") && current != null) {
                    current.setCorrectAnswer(line.substring(7).trim().toUpperCase());

                } else if (line.toLowerCase().startsWith("marks:") && current != null) {
                    try {
                        current.setMarks(Integer.parseInt(line.substring(6).trim()));
                    } catch (NumberFormatException e) {
                        current.setMarks(1); // default marks
                    }
                }
            }

            // Save the last question
            if (current != null) {
                current.setExam(exam);
                savedQuestions.add(questionRepository.save(current));
            }
        }

        return savedQuestions;
    }
}
