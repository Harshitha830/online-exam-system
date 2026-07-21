// src/App.jsx
// Main app component - defines all routes using React Router v6

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Subjects from "./pages/Subjects";
import Exams from "./pages/Exams";
import Questions from "./pages/Questions";
import TakeExam from "./pages/TakeExam";
import Result from "./pages/Result";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes - only accessible by ADMIN role */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <PrivateRoute role="ADMIN">
              <Subjects />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/exams"
          element={
            <PrivateRoute role="ADMIN">
              <Exams />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <PrivateRoute role="ADMIN">
              <Questions />
            </PrivateRoute>
          }
        />

        {/* Student Routes - only accessible by STUDENT role */}
        <Route
          path="/student"
          element={
            <PrivateRoute role="STUDENT">
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/exam/:examId"
          element={
            <PrivateRoute role="STUDENT">
              <TakeExam />
            </PrivateRoute>
          }
        />
        <Route
          path="/result"
          element={
            <PrivateRoute role="STUDENT">
              <Result />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
