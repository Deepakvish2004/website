// Frontend/src/pages/AdminWorkers.jsx
import React, { useState, useEffect } from "react";
import API from "../api/axios";

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    pincode: "",
    age: "",
    gender: "",
    address: "",
    services: "",
    image: "",
  });

  // Load all workers
  const loadWorkers = async () => {
    try {
      const res = await API.get("/workers");
      setWorkers(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error loading workers");
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add a worker (admin-only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/workers/register", {
        ...form,
        services: form.services
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      alert("✅ Worker created successfully!");
      setForm({
        image: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        services: "",
        pincode: "",
        age: "",
        gender: "",
        address: "",
      });
      loadWorkers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating worker");
    }
  };

  // Approve / Reject
  const handleStatusChange = async (id, status) => {
    try {
      await API.patch(`/workers/${id}/status`, { status });
      alert(`✅ Worker ${status}`);
      loadWorkers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating status");
    }
  };

  // Delete a worker (admin-only)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this worker?")) return;
    try {
      await API.delete(`/workers/${id}`);
      alert("🗑 Worker deleted successfully!");
      loadWorkers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error deleting worker");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">👷 Manage Workers</h1>

      {/* Create Worker Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">Add New Worker</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 rounded focus:ring focus:ring-indigo-300"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 rounded focus:ring focus:ring-indigo-300"
            required
          />
         <input
  name="phone"
  value={form.phone}
  onChange={handleChange}
  placeholder="Phone"
  className="border p-2 rounded focus:ring focus:ring-indigo-300"
  required
  pattern="\d{10}"      
  maxLength={10}        
  inputMode="numeric"   
  title="Phone number must be exactly 10 digits"
/>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="border p-2 rounded focus:ring focus:ring-indigo-300"
            required
          />
          <input
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            placeholder="Age"
            className="border p-2 rounded focus:ring focus:ring-indigo-300"
          />
          <input
  name="pincode"
  value={form.pincode}
  onChange={handleChange}
  placeholder="Pincode"
  className="border p-2 rounded focus:ring focus:ring-indigo-300"
  required
  pattern="\d+"         
  inputMode="numeric"
  title="Pincode must contain only numbers"
/>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="border p-2 rounded focus:ring focus:ring-indigo-300 col-span-2"
          >
            <option value="">Select Gender</option>
            <option value="male">Male ♂️</option>
            <option value="female">Female ♀️</option>
            <option value="other">Other ⚧</option>
          </select>
          <input
            name="services"
            value={form.services}
            onChange={handleChange}
            placeholder="Services (comma separated)"
            className="border p-2 rounded col-span-2 focus:ring focus:ring-indigo-300"
            required
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="border p-2 rounded col-span-2 focus:ring focus:ring-indigo-300"
            required
          />
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="border p-2 rounded col-span-2"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          ➕ Add Worker
        </button>
      </form>

      {/* Worker List */}
      <h2 className="text-xl font-semibold mb-4 text-white">All Workers</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              {/* <th className="p-3 text-left">Status</th> */}
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Pincode</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left">Gender</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Services</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 font-medium">{w.name}</td>
                {/* <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      w.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : w.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {w.status || "pending"}
                  </span>
                </td> */}
                <td className="p-3 font-medium">
                  <img
                    src={w.image}
                    alt={w.name}
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="p-3">{w.email}</td>
                <td className="p-3">{w.phone || "-"}</td>
                <td className="p-3">{w.pincode || "-"}</td>
                <td className="p-3">{w.age || "-"}</td>
                <td className="p-3">{w.gender || "-"}</td>
                <td className="p-3">{w.address || "-"}</td>
                <td className="p-3">
                  {Array.isArray(w.services) && w.services.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {w.services.map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-100 text-indigo-700 px-2 py-1 text-xs rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No Services</span>
                  )}
                </td>
                <td className="p-3 text-center space-x-2">
                  {/* {w.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(w._id, "approved")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(w._id, "rejected")}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Reject
                      </button>
                    </>
                  )} */}
                  <button
                    onClick={() => handleDelete(w._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {workers.length === 0 && (
              <tr>
                <td colSpan={11} className="p-4 text-center text-gray-500">
                  No workers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
