import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { LayoutDashboard, Users, Store } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkStyle = (path) =>
    `flex items-center gap-1 px-3 py-2 rounded-md transition 
     ${location.pathname === path 
        ? "bg-white text-teal-600 shadow-md" 
        : "text-white hover:bg-teal-500"}`;

  return (
    <nav
      style={{
        backgroundColor: "#0f766e",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Brand / SVG Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" fill="#14b8a6" />
          <path
            d="M8 12l2 2 4-4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 style={{ color: "white", fontWeight: "bold", fontSize: "1.25rem" }}>
          Store Rating
        </h1>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {user && user.role === "ADMIN" && (
          <>
            <Link to="/admin" className={linkStyle("/admin")}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/admin/users" className={linkStyle("/admin/users")}>
              <Users size={16} /> Users
            </Link>
            <Link to="/admin/stores" className={linkStyle("/admin/stores")}>
              <Store size={16} /> Stores
            </Link>
          </>
        )}
        {user && user.role === "OWNER" && (
          <Link to="/owner/dashboard" className={linkStyle("/owner/dashboard")}>
            <LayoutDashboard size={16} /> Owner Dashboard
          </Link>
        )}
        {user && user.role === "NORMAL" && (
          <>
            <Link to="/dashboard" className={linkStyle("/dashboard")}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/browseStores" className={linkStyle("/browseStores")}>
              <Store size={16} /> Browse Stores
            </Link>
          </>
        )}
      </div>

      {/* Auth buttons */}
      <div>
        {!user ? (
          <Link
            to="/login"
            style={{
              backgroundColor: "white",
              color: "#0f766e",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              fontWeight: "500",
              textDecoration: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "0.3s",
            }}
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#e5e7eb",
              color: "#0f766e",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              fontWeight: "500",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};
