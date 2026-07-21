import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getSubjects, addSubject, updateSubject, deleteSubject } from "../services/api";

const empty = { subjectName: "", subjectCode: "" };

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => { fetch(); }, []);

  const fetch = () => getSubjects().then((r) => setSubjects(r.data));

  const flash = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await updateSubject(editId, form); flash("Subject updated!"); }
      else        { await addSubject(form);             flash("Subject added!");   }
      setForm(empty); setEditId(null); fetch();
    } catch (err) {
      flash(err.response?.data?.subjectName || err.response?.data?.message || "Something went wrong", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    try { await deleteSubject(id); fetch(); flash("Subject deleted!"); }
    catch { flash("Failed to delete subject.", "danger"); }
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header">
          <div className="page-icon"><i className="bi bi-book"></i></div>
          <h4>Subject Management</h4>
        </div>

        {message.text && <div className={`alert alert-${message.type} mb-3`}>{message.text}</div>}

        {/* Form */}
        <div className="page-card">
          <div className="card-title">
            <i className={`bi ${editId ? "bi-pencil-square" : "bi-plus-circle"}`}></i>
            {editId ? "Edit Subject" : "Add New Subject"}
          </div>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-5">
              <label className="form-label">Subject Name</label>
              <input type="text" name="subjectName" className="form-control"
                placeholder="e.g. Java Programming"
                value={form.subjectName}
                onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
                required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Subject Code</label>
              <input type="text" name="subjectCode" className="form-control"
                placeholder="e.g. CS101"
                value={form.subjectCode}
                onChange={(e) => setForm({ ...form, subjectCode: e.target.value })}
                required />
            </div>
            <div className="col-md-3 d-flex align-items-end gap-2">
              <button type="submit" className="btn btn-primary">
                <i className={`bi ${editId ? "bi-check-lg" : "bi-plus-lg"} me-1`}></i>
                {editId ? "Update" : "Add Subject"}
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

        {/* Table */}
        <div className="page-card table-card">
          <div className="card-title">
            <i className="bi bi-list-ul"></i>All Subjects
            <span className="badge bg-primary ms-2">{subjects.length}</span>
          </div>
          {subjects.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-book"></i>
              <p>No subjects added yet. Add your first subject above.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr><th>#</th><th>Subject Name</th><th>Code</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {subjects.map((s, i) => (
                    <tr key={s.id}>
                      <td>{i + 1}</td>
                      <td><strong>{s.subjectName}</strong></td>
                      <td><span className="badge bg-primary">{s.subjectCode}</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => { setEditId(s.id); setForm({ subjectName: s.subjectName, subjectCode: s.subjectCode }); }}>
                          <i className="bi bi-pencil me-1"></i>Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(s.id)}>
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

export default Subjects;
