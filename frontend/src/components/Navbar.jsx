import { Link , useNavigate} from "react-router-dom";
import { useAuth } from "../context/authContext";

export const Navbar = () => {
  const { user, logout } = useAuth();

    const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    logout(); // Call the logout function from context
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <div className="flex gap-4">
        {user && user.role === "ADMIN" && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/users">Manage Users</Link>
            <Link to="/admin/stores">Manage Stores</Link>
          </>
        )}
        {user && user.role === "OWNER" && (
          <>
            <Link to="/owner/dashboard">Owner Dashboard</Link>
          </>
        )}
        {/* Links for Normal Users */}
        {user && user.role === "NORMAL" && (
          <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/browseStores">BrowseStores</Link>
             
          </>
        )}
      </div>
      <div>
        {!user ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};