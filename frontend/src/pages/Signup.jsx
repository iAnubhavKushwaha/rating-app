import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, address, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="border p-2" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2" />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="border p-2" />
        <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border p-2" />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Signup</button>
      </form>
    </div>
  );
};
