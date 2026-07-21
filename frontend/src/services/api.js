// src/services/api.js
// Central Axios instance - all API calls go through here
// Base URL points to Spring Boot backend

import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Auth ────────────────────────────────────────────────
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// ─── Subjects ────────────────────────────────────────────
export const getSubjects = () => API.get("/subjects");
export const addSubject = (data) => API.post("/subjects", data);
export const updateSubject = (id, data) => API.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => API.delete(`/subjects/${id}`);

// ─── Exams ───────────────────────────────────────────────
export const getExams = () => API.get("/exams");
export const getExamById = (id) => API.get(`/exams/${id}`);
export const createExam = (data) => API.post("/exams", data);
export const updateExam = (id, data) => API.put(`/exams/${id}`, data);
export const deleteExam = (id) => API.delete(`/exams/${id}`);

// ─── Questions ───────────────────────────────────────────
export const getQuestionsByExam = (examId) =>
  API.get(`/questions/exam/${examId}`);
export const addQuestion = (data) => API.post("/questions", data);
export const updateQuestion = (id, data) => API.put(`/questions/${id}`, data);
export const deleteQuestion = (id) => API.delete(`/questions/${id}`);

// Upload questions from Word file (multipart/form-data)
export const uploadQuestionsFromWord = (examId, formData) =>
  API.post(`/questions/upload/${examId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ─── Results ─────────────────────────────────────────────
export const submitExam = (data) => API.post("/results/submit", data);
export const getAllResults = () => API.get("/results");
export const getStudentResults = (email) =>
  API.get(`/results/student/${email}`);
export const checkAttempt = (email, examName) =>
  API.get(`/results/check?email=${email}&examName=${encodeURIComponent(examName)}`);
export const getDashboardStats = () => API.get("/results/dashboard");
