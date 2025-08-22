import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const data = await login(email, password);
        console.log("Login response:", data);
        const userRole = data.role;
        if (userRole === "ADMIN") {
            navigate("/admin"); // Redirect to admin dashboard
        } else if (userRole === "OWNER") {
            navigate("/owner/dashboard"); // Redirect to owner dashboard
        } else {
            navigate("/dashboard"); // Redirect to the general user dashboard
        }
    } catch (err) {
        alert(err.response?.data?.message || err.message);
    }
};

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2" />
        <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
};
