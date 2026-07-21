import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getExamById, getQuestionsByExam, submitExam, checkAttempt } from "../services/api";

function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (submittedRef.current) return;
      if (!auto && !window.confirm("Are you sure you want to submit the exam?")) return;
      submittedRef.current = true;
      setSubmitting(true);
      try {
        const res = await submitExam({
          examId: parseInt(examId),
          studentEmail: user.email,
          studentName: user.name,
          answers,
        });
        navigate("/result", { state: { result: res.data } });
      } catch (err) {
        alert(err.response?.data?.message || "Submission failed!");
        submittedRef.current = false;
        setSubmitting(false);
      }
    },
    [examId, user, answers, navigate]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const examRes = await getExamById(examId);
        const examData = examRes.data;
        const attemptRes = await checkAttempt(user.email, examData.examName);
        if (attemptRes.data.attempted) {
          alert("You have already completed this exam!");
          navigate("/student");
          return;
        }
        const qRes = await getQuestionsByExam(examId);
        setExam(examData);
        setQuestions(qRes.data);
        setTimeLeft(examData.duration * 60);
      } catch {
        alert("Failed to load exam!");
        navigate("/student");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [examId, user.email, navigate]);

  useEffect(() => {
    if (loading || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); handleSubmit(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, handleSubmit]);

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (loading) return <div className="full-spinner"><div className="spinner-border"></div></div>;

  if (questions.length === 0) return (
    <>
      <Navbar />
      <div className="page-wrapper text-center">
        <div className="alert alert-warning">No questions available for this exam.</div>
        <button className="btn btn-primary" onClick={() => navigate("/student")}>Back to Dashboard</button>
      </div>
    </>
  );

  const q = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const timerClass = timeLeft <= 60 ? "timer-danger" : timeLeft <= 300 ? "timer-warning" : "timer-normal";

  return (
    <>
      <Navbar />
      <div className="page-wrapper" style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Header */}
        <div className="exam-header">
          <div>
            <div className="exam-title">{exam?.examName}</div>
            <div className="exam-subject">{exam?.subject?.subjectName}</div>
          </div>
          <div className={`timer-badge ${timerClass}`}>
            <i className="bi bi-clock"></i>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress */}
        <div className="question-progress">
          <div className="question-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <p className="question-number">Question {currentIndex + 1} of {questions.length}</p>
          <p className="question-text">{q.questionText}</p>

          {["A", "B", "C", "D"].map((opt) => {
            const selected = answers[q.id] === opt;
            return (
              <div
                key={opt}
                className={`option-label ${selected ? "selected" : ""}`}
                onClick={() => setAnswers({ ...answers, [q.id]: opt })}
              >
                <span className="opt-badge">{opt}</span>
                {q[`option${opt}`]}
              </div>
            );
          })}

          <div className="d-flex justify-content-between align-items-center mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setCurrentIndex((i) => i - 1)}
              disabled={currentIndex === 0}
            >
              <i className="bi bi-arrow-left me-1"></i>Previous
            </button>

            <span style={{ fontSize: ".85rem", color: "var(--text-muted)" }}>
              {Object.keys(answers).length} / {questions.length} answered
            </span>

            {currentIndex < questions.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setCurrentIndex((i) => i + 1)}>
                Next<i className="bi bi-arrow-right ms-1"></i>
              </button>
            ) : (
              <button className="btn btn-success" onClick={() => handleSubmit(false)} disabled={submitting}>
                {submitting ? <><span className="spinner-border spinner-border-sm me-1"></span>Submitting...</> : <><i className="bi bi-check-lg me-1"></i>Submit Exam</>}
              </button>
            )}
          </div>
        </div>

        {/* Question Nav Dots */}
        <div className="question-nav-dots mt-3">
          {questions.map((item, i) => (
            <button
              key={item.id}
              className={`q-dot ${answers[item.id] ? "answered" : ""} ${i === currentIndex ? "current" : ""}`}
              onClick={() => setCurrentIndex(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default TakeExam;
