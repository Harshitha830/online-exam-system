import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getExams, createExam, updateExam, deleteExam, getSubjects } from "../services/api";

const empty = { examName: "", duration: "", totalMarks: "", subject: { id: "" } };

function Exams() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchExams();
    getSubjects().then((r) => setSubjects(r.data));
  }, []);

  const fetchExams = () => getExams().then((r) => setExams(r.data));

  const flash = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "subjectId") setForm({ ...form, subject: { id: value } });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await updateExam(editId, form); flash("Exam updated!"); }
      else        { await createExam(form);          flash("Exam created!"); }
      setForm(empty); setEditId(null); fetchExams();
    } catch (err) {
      const d = err.response?.data;
      flash(d?.examName || d?.message || "Something went wrong", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;
    try { await deleteExam(id); fetchExams(); flash("Exam deleted!"); }
    catch { flash("Failed to delete exam.", "danger"); }
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header">
          <div className="page-icon"><i className="bi bi-clipboard"></i></div>
          <h4>Exam Management</h4>
        </div>

        {message.text && <div className={`alert alert-${message.type} mb-3`}>{message.text}</div>}

        {/* Form */}
        <div className="page-card">
          <div className="card-title">
            <i className={`bi ${editId ? "bi-pencil-square" : "bi-plus-circle"}`}></i>
            {editId ? "Edit Exam" : "Create New Exam"}
          </div>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Exam Name</label>
              <input type="text" name="examName" className="form-control"
                placeholder="e.g. Java Mid-Term"
                value={form.examName} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <label className="form-label">Subject</label>
              <select name="subjectId" className="form-select"
                value={form.subject.id} onChange={handleChange} required>
                <option value="">-- Select Subject --</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.subjectName}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Duration (min)</label>
              <input type="number" name="duration" className="form-control"
                placeholder="60" value={form.duration} onChange={handleChange} required min="1" />
            </div>
            <div className="col-md-2">
              <label className="form-label">Total Marks</label>
              <input type="number" name="totalMarks" className="form-control"
                placeholder="100" value={form.totalMarks} onChange={handleChange} required min="1" />
            </div>
            <div className="col-md-1 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">
                <i className={`bi ${editId ? "bi-check-lg" : "bi-plus-lg"}`}></i>
              </button>
            </div>
            {editId && (
              <div className="col-12">
                <button type="button" className="btn btn-outline-secondary btn-sm"
                  onClick={() => { setEditId(null); setForm(empty); }}>
                  Cancel Edit
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="page-card table-card">
          <div className="card-title">
            <i className="bi bi-list-ul"></i>All Exams
            <span className="badge bg-primary ms-2">{exams.length}</span>
          </div>
          {exams.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-clipboard-x"></i>
              <p>No exams created yet. Create your first exam above.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr><th>#</th><th>Exam Name</th><th>Subject</th><th>Duration</th><th>Total Marks</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {exams.map((exam, i) => (
                    <tr key={exam.id}>
                      <td>{i + 1}</td>
                      <td><strong>{exam.examName}</strong></td>
                      <td><span className="badge bg-primary">{exam.subject?.subjectName || "N/A"}</span></td>
                      <td>{exam.duration} min</td>
                      <td>{exam.totalMarks}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => { setEditId(exam.id); setForm({ examName: exam.examName, duration: exam.duration, totalMarks: exam.totalMarks, subject: { id: exam.subject?.id || "" } }); }}>
                          <i className="bi bi-pencil me-1"></i>Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(exam.id)}>
                          <i className="bi bi-trash me-1"></i>Delete
                        </button>
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

export default Exams;
