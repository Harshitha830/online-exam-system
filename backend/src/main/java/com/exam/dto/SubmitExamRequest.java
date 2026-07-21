package com.exam.dto;

import java.util.Map;

// DTO to receive exam submission from student
// answers: Map of questionId -> selected option ("A", "B", "C", or "D")
public class SubmitExamRequest {

    private Long examId;
    private String studentEmail;
    private String studentName;

    // Key = questionId, Value = selected answer ("A", "B", "C", "D")
    private Map<Long, String> answers;

    public SubmitExamRequest() {}

    public Long getExamId() { return examId; }
    public void setExamId(Long examId) { this.examId = examId; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public Map<Long, String> getAnswers() { return answers; }
    public void setAnswers(Map<Long, String> answers) { this.answers = answers; }
}
