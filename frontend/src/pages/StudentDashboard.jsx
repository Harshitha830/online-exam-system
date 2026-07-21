import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getExams, checkAttempt, getStudentResults } from "../services/api";

function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [exams, setExams] = useState([]);
  const [attemptedMap, setAttemptedMap] = useState({});
  const [resultCount, setResultCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [examRes, resultRes] = await Promise.all([
          getExams(),
          getStudentResults(user.email),
        ]);
        const examList = examRes.data;
        setExams(examList);
        setResultCount(resultRes.data.length);

        const map = {};
        await Promise.all(
          examList.map(async (exam) => {
            try {
              const r = await checkAttempt(user.email, exam.examName);
              map[exam.examName] = r.data.attempted;
            } catch {
              map[exam.examName] = false;
            }
          })
        );
        setAttemptedMap(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.email]);

  const attempted = Object.values(attemptedMap).filter(Boolean).length;

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        {/* Welcome Header */}
        <div className="page-card mb-3" style={{ background: "linear-gradient(135deg, #4f46e5, #3730a3)", color: "#fff", border: "none" }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 52, height: 52, background: "rgba(255,255,255,.2)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem" }}>
              <i className="bi bi-person-circle"></i>
            </div>
            <div>
              <h5 className="fw-bold mb-0" style={{ color: "#fff" }}>Welcome, {user.name}!</h5>
              <p className="mb-0" style={{ opacity: .8, fontSize: ".875rem" }}>
                {attempted} of {exams.length} exams completed · {resultCount} result{resultCount !== 1 ? "s" : ""} recorded
              </p>
            </div>
            <button
              className="btn btn-sm ms-auto"
              style={{ background: "rgba(255,255,255,.2)", color: "#fff", border: "1px solid rgba(255,255,255,.3)" }}
              onClick={() => navigate("/result")}
            >
              <i className="bi bi-bar-chart me-1"></i>My Results
            </button>
          </div>
        </div>

        <div className="page-header">
          <div className="page-icon"><i className="bi bi-clipboard-check"></i></div>
          <h4>Available Exams</h4>
        </div>

        {loading ? (
          <div className="full-spinner"><div className="spinner-border"></div></div>
        ) : exams.length === 0 ? (
          <div className="empty-state page-card">
            <i className="bi bi-clipboard-x"></i>
            <p>No exams available at the moment. Check back later.</p>
          </div>
        ) : (
          <div className="row g-3">
            {exams.map((exam) => {
              const done = attemptedMap[exam.examName];
              return (
                <div className="col-md-4 col-sm-6" key={exam.id}>
                  <div className="exam-card h-100">
                    <div className="exam-card-header">
                      <i className="bi bi-clipboard-check"></i>
                      {exam.examName}
                    </div>
                    <div className="exam-card-body">
                      <div className="exam-meta">
                        <div className="exam-meta-item">
                          <i className="bi bi-book"></i>
                          <span><strong>Subject:</strong> {exam.subject?.subjectName || "N/A"}</span>
                        </div>
                        <div className="exam-meta-item">
                          <i className="bi bi-clock"></i>
                          <span><strong>Duration:</strong> {exam.duration} minutes</span>
                        </div>
                        <div className="exam-meta-item">
                          <i className="bi bi-award"></i>
                          <span><strong>Total Marks:</strong> {exam.totalMarks}</span>
                        </div>
                      </div>
                      {done ? (
                        <div className="alert alert-success mb-0 text-center py-2">
                          <i className="bi bi-check-circle-fill me-1"></i>Completed
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => navigate(`/exam/${exam.id}`)}
                        >
                          <i className="bi bi-play-fill me-1"></i>Start Exam
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default StudentDashboard;
