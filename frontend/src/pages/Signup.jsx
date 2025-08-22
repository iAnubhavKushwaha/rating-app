import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Home } from "lucide-react";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !address || !password) {
      return setError("All fields are required.");
    }

    setLoading(true);
    try {
      await signup(name, email, address, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-teal-50 via-white to-gray-100">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Create an Account
        </h1>
        <p className="text-gray-500 text-center mt-2 mb-6 text-sm">
          Sign up to start rating stores and explore insights
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded-md mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-teal-500">
            <User className="w-5 h-5 text-gray-400" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full p-3 rounded-lg bg-transparent outline-none"
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-teal-500">
            <Mail className="w-5 h-5 text-gray-400" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              type="email"
              className="w-full p-3 rounded-lg bg-transparent outline-none"
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-teal-500">
            <Home className="w-5 h-5 text-gray-400" />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="w-full p-3 rounded-lg bg-transparent outline-none"
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-teal-500">
            <Lock className="w-5 h-5 text-gray-400" />
            <input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-transparent outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            to="/"
            className="text-teal-600 font-medium hover:underline transition duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
