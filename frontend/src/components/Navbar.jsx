import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../css/style.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const adminLinks = [
    { to: "/admin",           icon: "bi-speedometer2", label: "Dashboard" },
    { to: "/admin/subjects",  icon: "bi-book",         label: "Subjects"  },
    { to: "/admin/exams",     icon: "bi-clipboard",    label: "Exams"     },
    { to: "/admin/questions", icon: "bi-question-lg",  label: "Questions" },
  ];

  const isAdmin = user.role === "ADMIN";

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to={isAdmin ? "/admin" : "/student"}>
          <i className="bi bi-mortarboard-fill me-2"></i>
          ExamPortal
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          style={{ color: "#fff" }}
        >
          <i className="bi bi-list" style={{ fontSize: "1.5rem" }}></i>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          {isAdmin && (
            <ul className="navbar-nav me-auto gap-1 mt-2 mt-lg-0">
              {adminLinks.map((link) => (
                <li className="nav-item" key={link.to}>
                  <Link
                    to={link.to}
                    className="nav-link px-3 py-1 rounded"
                    style={{
                      color: location.pathname === link.to
                        ? "#fff"
                        : "rgba(255,255,255,.75)",
                      background: location.pathname === link.to
                        ? "rgba(255,255,255,.2)"
                        : "transparent",
                      fontWeight: 600,
                      fontSize: ".875rem",
                      transition: ".2s",
                    }}
                  >
                    <i className={`bi ${link.icon} me-1`}></i>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="ms-auto d-flex align-items-center gap-3 mt-2 mt-lg-0">
            <div className="nav-user">
              <i className="bi bi-person-circle"></i>
              <span>{user.name}</span>
              <span className="role-badge">{user.role}</span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
