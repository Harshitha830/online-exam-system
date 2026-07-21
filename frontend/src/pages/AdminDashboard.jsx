import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getDashboardStats } from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({ totalSubjects: 0, totalExams: 0, totalQuestions: 0, results: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Subjects",   value: stats.totalSubjects,       icon: "bi-book-fill",            cls: "stat-blue"   },
    { label: "Total Exams",      value: stats.totalExams,          icon: "bi-clipboard-check-fill", cls: "stat-green"  },
    { label: "Total Questions",  value: stats.totalQuestions,      icon: "bi-question-circle-fill", cls: "stat-orange" },
    { label: "Student Results",  value: stats.results.length,      icon: "bi-people-fill",          cls: "stat-purple" },
  ];

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header">
          <div className="page-icon"><i className="bi bi-speedometer2"></i></div>
          <h4>Admin Dashboard</h4>
        </div>

        {/* Stat Cards */}
        <div className="row g-3 mb-4">
          {statCards.map((s) => (
            <div className="col-6 col-md-3" key={s.label}>
              <div className={`stat-card ${s.cls}`}>
                <div className="stat-icon-wrap"><i className={`bi ${s.icon}`}></i></div>
                <div className="stat-info">
                  <h3>{loading ? "—" : s.value}</h3>
                  <p>{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results Table */}
        <div className="page-card table-card">
          <div className="card-title">
            <i className="bi bi-table"></i>Recent Student Results
          </div>
          {stats.results.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <p>No results yet. Students haven't taken any exams.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Exam</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.results.map((r, i) => (
                    <tr key={r.id}>
                      <td>{i + 1}</td>
                      <td><strong>{r.studentName}</strong></td>
                      <td className="text-muted">{r.studentEmail}</td>
                      <td>{r.examName}</td>
                      <td><strong>{r.score}</strong></td>
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

export default AdminDashboard;
