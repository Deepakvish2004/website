import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function WorkerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/workers/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "worker");
      navigate("/worker/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
      
      {/* Decorative circles */}
      <div className="absolute w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 bottom-10 right-10 animate-pulse"></div>

      {/* Login Card */}
      <div className="relative z-10 bg-white/20 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-96 text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">👷 Worker Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Worker Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/30 text-black focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/30 text-black focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <button
            type="submit"
            className="mt-2 bg-yellow-400 text-black font-bold py-2 rounded-lg shadow hover:bg-yellow-500 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
