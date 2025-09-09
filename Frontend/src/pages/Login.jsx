import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react"; // icons

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/auth/login", { email, password });

      // save token + user in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      // redirect based on role
      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.role === "worker") {
        navigate("/worker/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/30">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Welcome Back 👋
        </h2>
        {error && (
          <p className="text-red-300 text-center mb-4 font-medium">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="flex items-center gap-3 bg-white/30 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-400 transition">
            <Mail className="text-gray-700" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center gap-3 bg-white/30 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-indigo-400 transition">
            <Lock className="text-gray-700" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 transition-all shadow-md"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-white/80 text-sm mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-yellow-300 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
