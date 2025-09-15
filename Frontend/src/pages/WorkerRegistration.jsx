// src/pages/WorkerRegistration.jsx
import React, { useState } from "react";
import API from "../api/axios";

export default function WorkerRegistration() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", pincode: "",
    age: "", gender: "", address: "", services: "", image: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/workers/register", {
        ...form,
        services: form.services.split(",").map(s => s.trim()).filter(Boolean),
      });
      alert("✅ Registration successful! Please wait for admin approval.");
      setForm({ name: "", email: "", phone: "", password: "", pincode: "", age: "", gender: "", address: "", services: "", image: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error registering worker");
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">👷 Worker Registration</h2>
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="border p-2 rounded mb-3 w-full" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="border p-2 rounded mb-3 w-full" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border p-2 rounded mb-3 w-full" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="border p-2 rounded mb-3 w-full" />
        <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="border p-2 rounded mb-3 w-full" />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} className="border p-2 rounded mb-3 w-full" />
        <select name="gender" value={form.gender} onChange={handleChange} className="border p-2 rounded mb-3 w-full">
          <option value="">Select Gender</option>
          <option value="male">Male ♂️</option>
          <option value="female">Female ♀️</option>
          <option value="other">Other ⚧</option>
        </select>
        <input name="services" placeholder="Services (comma separated)" value={form.services} onChange={handleChange} required className="border p-2 rounded mb-3 w-full" />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="border p-2 rounded mb-3 w-full" />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="border p-2 rounded mb-3 w-full" />
        <button type="submit" className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700">
          Register
        </button>
      </form>
    </div>
  );
}
