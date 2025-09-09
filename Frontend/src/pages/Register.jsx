import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 px-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/30">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Create an Account
        </h2>
        <form onSubmit={handle} className="space-y-4">
          <input
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            required
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            required
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            required
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 transition-all shadow-md"
          >
            Register
          </button>
        </form>
        <p className="text-center text-white/80 text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-300 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
