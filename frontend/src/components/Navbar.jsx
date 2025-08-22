import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to the home page after logout
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Store Rating App</h1>
      <div className="flex gap-4">
        {user && user.role === "ADMIN" && (
          <>
            <Link to="/admin" className="hover:underline">Dashboard</Link>
            <Link to="/admin/users" className="hover:underline">Manage Users</Link>
            <Link to="/admin/stores" className="hover:underline">Manage Stores</Link>
          </>
        )}
        {user && user.role === "OWNER" && (
          <Link to="/owner/dashboard" className="hover:underline">Owner Dashboard</Link>
        )}
        {user && user.role === "NORMAL" && (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/browseStores" className="hover:underline">Browse Stores</Link>
          </>
        )}
      </div>
      <div>
        {!user ? (
          <Link to="/login" className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-blue-100 transition">
            Login
          </Link>
        ) : (
          <button onClick={handleLogout} className="bg-red-400 px-4 py-2 rounded hover:bg-red-600 transition">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};