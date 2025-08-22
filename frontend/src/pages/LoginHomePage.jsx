import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

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
      const userRole = data.role;
      if (userRole === "ADMIN") navigate("/admin");
      else if (userRole === "OWNER") navigate("/owner/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left Side - Welcome Section */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700 text-white p-8">
        <h1 className="text-4xl font-extrabold mb-4 text-center">
          Welcome to Store Rating
        </h1>
        <p className="text-lg max-w-md text-center opacity-90 mb-6">
          Share your experience, rate your favorite stores, and help others make informed choices!
        </p>
        <img
          src="/feedback-3083100.jpg"
          alt="Store Rating"
          className="rounded-2xl shadow-xl max-w-md w-full object-contain mx-auto"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center items-center bg-gray-50 p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
            Login
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transform hover:scale-[1.02] transition duration-200 shadow-md cursor-pointer"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/resetPassword"
              className="text-teal-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="mt-2 text-center text-gray-600">
            New here?{" "}
            <Link
              to="/signup"
              className="text-teal-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
