// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react"; // icons

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });

      if (res.data.role !== "admin") {
        setError("You are not an admin!");
        return;
      }

      // Save admin token + user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      navigate("/admin/"); // redirect to admin dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center rounded-4xl border-5 border-black min-h-screen bg-[radial-gradient(circle_at_center,_#1e3a8a,_#9333ea,_#db2777)] px-4">
      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-md bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/30"
      >
        {/* Icon + Title */}
        <div className="flex flex-col items-center mb-6">
          <ShieldCheck className="w-12 h-12 text-yellow-300" />
          <h1 className="text-3xl font-extrabold text-white mt-3">Admin Login</h1>
          <p className="text-sm text-white/70">Secure access for admins only</p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-300 bg-red-900/30 p-2 rounded text-center mb-4">
            {error}
          </p>
        )}

        {/* Email Input */}
        <div className="flex items-center gap-3 bg-white/30 border border-gray-300 rounded-lg p-3 mb-4 focus-within:ring-2 focus-within:ring-purple-400 transition">
          <Mail className="text-gray-700" size={20} />
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-600"
            required
          />
        </div>

        {/* Password Input */}
        <div className="flex items-center gap-3 bg-white/30 border border-gray-300 rounded-lg p-3 mb-6 focus-within:ring-2 focus-within:ring-purple-400 transition">
          <Lock className="text-gray-700" size={20} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-600"
            required
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-pink-600 hover:to-indigo-600 transition-all shadow-md"
        >
          Login
        </button>
      </form>
    </div>
  );
}
