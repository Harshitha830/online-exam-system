package com.exam.entity;

import jakarta.persistence.*;

// Maps to 'results' table in MySQL
@Entity
@Table(name = "results")
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentEmail;
    private String studentName;
    private String examName;
    private int score;
    private int totalMarks;
    private double percentage;

    // "Pass" or "Fail"
    private String status;

    // Constructors
    public Result() {}

    public Result(String studentEmail, String studentName, String examName, int score, int totalMarks, double percentage, String status) {
        this.studentEmail = studentEmail;
        this.studentName = studentName;
        this.examName = examName;
        this.score = score;
        this.totalMarks = totalMarks;
        this.percentage = percentage;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getExamName() { return examName; }
    public void setExamName(String examName) { this.examName = examName; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
