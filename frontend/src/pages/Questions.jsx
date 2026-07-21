import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getExams, getQuestionsByExam, addQuestion, updateQuestion,
  deleteQuestion, uploadQuestionsFromWord,
} from "../services/api";

const empty = {
  questionText: "", optionA: "", optionB: "", optionC: "", optionD: "",
  correctAnswer: "", marks: "", exam: { id: "" },
};

function Questions() {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [wordFile, setWordFile] = useState(null);
  const [uploadExamId, setUploadExamId] = useState("");
  const [activeTab, setActiveTab] = useState("manual");

  useEffect(() => { getExams().then((r) => setExams(r.data)); }, []);

  const fetchQ = (id) => { if (id) getQuestionsByExam(id).then((r) => setQuestions(r.data)); };

  const flash = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "examId") setForm({ ...form, exam: { id: value } });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await updateQuestion(editId, form); flash("Question updated!"); }
      else        { await addQuestion(form);             flash("Question added!");   }
      setForm(empty); setEditId(null);
      if (selectedExamId) fetchQ(selectedExamId);
    } catch (err) {
      flash(err.response?.data?.message || "Failed to save question.", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    await deleteQuestion(id);
    fetchQ(selectedExamId);
    flash("Question deleted!");
  };

  const handleWordUpload = async (e) => {
    e.preventDefault();
    if (!wordFile || !uploadExamId) { flash("Select an exam and a .docx file.", "warning"); return; }
    const fd = new FormData();
    fd.append("file", wordFile);
    try {
      const res = await uploadQuestionsFromWord(uploadExamId, fd);
      flash(res.data.message);
      if (selectedExamId === uploadExamId) fetchQ(selectedExamId);
    } catch (err) {
      flash(err.response?.data?.message || "Upload failed.", "danger");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header">
          <div className="page-icon"><i className="bi bi-question-circle"></i></div>
          <h4>Question Management</h4>
        </div>

        {message.text && <div className={`alert alert-${message.type} mb-3`}>{message.text}</div>}

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          {[
            { key: "manual", icon: "bi-pencil-square", label: "Add Manually" },
            { key: "upload", icon: "bi-file-word",     label: "Upload from Word" },
          ].map((t) => (
            <li className="nav-item" key={t.key}>
              <button className={`nav-link ${activeTab === t.key ? "active" : ""}`}
                onClick={() => setActiveTab(t.key)}>
                <i className={`bi ${t.icon} me-1`}></i>{t.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Manual Form */}
        {activeTab === "manual" && (
          <div className="page-card">
            <div className="card-title">
              <i className={`bi ${editId ? "bi-pencil-square" : "bi-plus-circle"}`}></i>
              {editId ? "Edit Question" : "Add New Question"}
            </div>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-5">
                <label className="form-label">Select Exam</label>
                <select name="examId" className="form-select"
                  value={form.exam.id} onChange={handleChange} required>
                  <option value="">-- Select Exam --</option>
                  {exams.map((ex) => <option key={ex.id} value={ex.id}>{ex.examName}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Correct Answer</label>
                <select name="correctAnswer" className="form-select"
                  value={form.correctAnswer} onChange={handleChange} required>
                  <option value="">-- Select --</option>
                  {["A","B","C","D"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Marks</label>
                <input type="number" name="marks" className="form-control"
                  placeholder="e.g. 2" value={form.marks} onChange={handleChange} required min="1" />
              </div>
              <div className="col-12">
                <label className="form-label">Question Text</label>
                <textarea name="questionText" className="form-control" rows="2"
                  placeholder="Enter the question..."
                  value={form.questionText} onChange={handleChange} required />
              </div>
              {["A","B","C","D"].map((opt) => (
                <div className="col-md-6" key={opt}>
                  <label className="form-label">Option {opt}</label>
                  <input type="text" name={`option${opt}`} className="form-control"
                    placeholder={`Option ${opt}`}
                    value={form[`option${opt}`]} onChange={handleChange} required />
                </div>
              ))}
              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <i className={`bi ${editId ? "bi-check-lg" : "bi-plus-lg"} me-1`}></i>
                  {editId ? "Update Question" : "Add Question"}
                </button>
                {editId && (
                  <button type="button" className="btn btn-outline-secondary"
                    onClick={() => { setEditId(null); setForm(empty); }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Word Upload */}
        {activeTab === "upload" && (
          <div className="page-card">
            <div className="card-title"><i className="bi bi-file-word"></i>Upload from Word (.docx)</div>
            <div className="alert alert-info mb-3" style={{ fontSize: ".85rem" }}>
              <strong>Expected format per question:</strong>
              <pre className="mb-0 mt-1" style={{ fontSize: ".82rem", background: "transparent" }}>
{`Question: What is Java?
A. Programming Language
B. Database
C. Browser
D. Operating System
Answer: A
Marks: 2`}
              </pre>
            </div>
            <form onSubmit={handleWordUpload} className="row g-3">
              <div className="col-md-5">
                <label className="form-label">Select Exam</label>
                <select className="form-select" value={uploadExamId}
                  onChange={(e) => setUploadExamId(e.target.value)} required>
                  <option value="">-- Select Exam --</option>
                  {exams.map((ex) => <option key={ex.id} value={ex.id}>{ex.examName}</option>)}
                </select>
              </div>
              <div className="col-md-5">
                <label className="form-label">Choose .docx File</label>
                <input type="file" className="form-control" accept=".docx"
                  onChange={(e) => setWordFile(e.target.files[0])} required />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-success w-100">
                  <i className="bi bi-upload me-1"></i>Upload
                </button>
              </div>
            </form>
          </div>
        )}

        {/* View Questions */}
        <div className="page-card table-card">
          <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
            <div className="card-title mb-0">
              <i className="bi bi-list-ol"></i>Questions
              {questions.length > 0 && <span className="badge bg-primary ms-2">{questions.length}</span>}
            </div>
            <select className="form-select" style={{ width: "auto" }}
              value={selectedExamId}
              onChange={(e) => { setSelectedExamId(e.target.value); fetchQ(e.target.value); }}>
              <option value="">-- Select Exam to View --</option>
              {exams.map((ex) => <option key={ex.id} value={ex.id}>{ex.examName}</option>)}
            </select>
          </div>

          {questions.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-question-circle"></i>
              <p>{selectedExamId ? "No questions for this exam." : "Select an exam to view its questions."}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th><th>Question</th><th>A</th><th>B</th><th>C</th><th>D</th>
                    <th>Answer</th><th>Marks</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q, i) => (
                    <tr key={q.id}>
                      <td>{i + 1}</td>
                      <td style={{ maxWidth: 220, whiteSpace: "normal" }}>{q.questionText}</td>
                      <td>{q.optionA}</td><td>{q.optionB}</td>
                      <td>{q.optionC}</td><td>{q.optionD}</td>
                      <td><span className="badge bg-success">{q.correctAnswer}</span></td>
                      <td>{q.marks}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => {
                            setEditId(q.id);
                            setForm({ questionText: q.questionText, optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD, correctAnswer: q.correctAnswer, marks: q.marks, exam: { id: q.exam?.id || "" } });
                            setActiveTab("manual");
                            window.scrollTo(0, 0);
                          }}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(q.id)}>
                          <i className="bi bi-trash"></i>
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

export default Questions;
