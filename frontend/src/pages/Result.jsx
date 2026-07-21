import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getStudentResults } from "../services/api";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const freshResult = location.state?.result || null;
  const [results, setResults] = useState([]);

  useEffect(() => {
    getStudentResults(user.email)
      .then((res) => setResults(res.data))
      .catch(console.error);
  }, [user.email]);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        {/* Fresh Result Hero */}
        {freshResult && (
          <div className="row justify-content-center mb-4">
            <div className="col-md-5">
              <div className={`result-hero ${freshResult.status === "Pass" ? "pass" : "fail"}`}>
                <div className="result-icon">
                  <i className={`bi ${freshResult.status === "Pass" ? "bi-trophy-fill" : "bi-x-circle-fill"}`}></i>
                </div>
                <div className="result-exam">{freshResult.examName}</div>
                <div className="result-score">{freshResult.score}</div>
                <div className="result-label">Marks Scored</div>
                <div className="result-pct">{freshResult.percentage}%</div>
                <div className="result-status-badge">{freshResult.status}</div>
              </div>
            </div>
          </div>
        )}

        {/* All Results */}
        <div className="page-card table-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="card-title mb-0">
              <i className="bi bi-bar-chart"></i>My Exam Results
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/student")}>
              <i className="bi bi-arrow-left me-1"></i>Dashboard
            </button>
          </div>

          {results.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-clipboard-x"></i>
              <p>No results yet. Take an exam to see your results here.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Exam Name</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={r.id}>
                      <td>{i + 1}</td>
                      <td><strong>{r.examName}</strong></td>
                      <td>{r.score}</td>
                      <td>{r.percentage}%</td>
                      <td>
                        <span className={`badge ${r.status === "Pass" ? "bg-success" : "bg-danger"}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Result;
