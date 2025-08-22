import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";

export const LoginHomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);
      console.log("Login response:", data);
      const userRole = data.role;

      // Redirect based on user role
      if (userRole === "ADMIN") {
        navigate("/admin"); // Redirect to admin dashboard
      } else if (userRole === "OWNER") {
        navigate("/owner/dashboard"); // Redirect to owner dashboard
      } else {
        navigate("/dashboard"); // Redirect to the general user dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Welcome Section */}
      <div className="flex-1 bg-blue-500 text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Store Rating App</h1>
        <p className="text-lg max-w-lg text-center mb-6">
          Rate your favorite stores and help others make informed decisions!
        </p>
        <img 
          src="https://via.placeholder.com/400" // Placeholder image, replace with your image path
          alt="Store Rating"
          className="rounded shadow-lg"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Login</h2>
        
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 cursor-pointer"
          >
            Login
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <Link to="/resetPassword" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
        
        <div className="mt-2 text-center">
          <span className="text-gray-600">New here? </span>
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};