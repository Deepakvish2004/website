// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // Fetch user's bookings
  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // Poll every 5s for real-time updates
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  // Cancel booking handler
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await API.put(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
      alert("✅ Booking cancelled");
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  // Approve worker’s completed work
  const handleApprove = async (id) => {
    if (!window.confirm("Approve this work as completed?")) return;
    try {
      await API.put(`/bookings/${id}/approve`);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "completed", userApproval: true } : b
        )
      );
      alert("🎉 Booking marked as completed!");
    } catch (err) {
      console.error("Approve error:", err);
      alert(err.response?.data?.message || "Failed to approve work");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-lg font-semibold">
        Loading your bookings…
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
      <h1 className="text-3xl font-extrabold text-white text-center mb-8 drop-shadow-lg">
        📋 My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="text-center text-white text-lg font-medium">
          You have no bookings yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white/90 rounded-xl shadow-lg p-5 hover:scale-[1.02] transform transition duration-300"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {b.service}
              </h2>
              <p className="text-gray-600 text-sm mb-1">
                <b>Price:</b> ₹{b.price || "N/A"}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <b>Date:</b> {new Date(b.bookingDate).toLocaleString()}
              </p>

              {/* ✅ Status with user approval */}
              <p
                className={`text-sm font-semibold mb-1 ${
                  b.status === "completed"
                    ? "text-green-600"
                    : b.status === "cancelled"
                    ? "text-red-600"
                    : b.status === "done"
                    ? "text-blue-600"
                    : "text-yellow-600"
                }`}
              >
                <b>Status:</b>{" "}
                {b.status === "done" && !b.userApproval
                  ? "Work done ✅ (Waiting for your approval)"
                  : b.status === "completed" && b.userApproval
                  ? "Completed 🎉 (You approved)"
                  : b.status}
              </p>

              <p className="text-gray-600 text-sm mb-1">
                <b>Details:</b> {b.details || "—"}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <b>Address:</b> {b.address || "—"}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <b>Phone:</b> {b.phone || "—"}
              </p>
              <p className="text-gray-600 text-sm mb-2">
                <b>Worker:</b>{" "}
                {b.assignedWorker ? (
                  <button
                    className="text-blue-600 underline hover:text-blue-800"
                    onClick={() => setSelectedWorker(b.assignedWorker)}
                  >
                    {b.assignedWorker.name}{" "}
                    {b.status === "accepted" ? "(Accepted ✅)" : ""}
                  </button>
                ) : b.status === "pending" ? (
                  "Not assigned yet"
                ) : (
                  "Assigning..."
                )}
              </p>

              {/* ✅ User Actions */}
              {["pending", "accepted"].includes(b.status) && (
                <button
                  onClick={() => handleCancel(b._id)}
                  className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  ❌ Cancel Booking
                </button>
              )}

              {b.status === "done" && !b.userApproval && (
                <button
                  onClick={() => handleApprove(b._id)}
                  className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  ✅ Approve Completion
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Worker Details Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 p-[2px] rounded-2xl shadow-2xl w-[420px]">
            <div className="bg-white rounded-2xl p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
                onClick={() => setSelectedWorker(null)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-extrabold mb-5 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
                👷 Worker Details
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="text-lg">
                  <b>Name:</b> {selectedWorker.name}
                </p>
                <p>
                  <b>Age:</b> {selectedWorker.age || "N/A"}
                </p>
                <p>
                  <b>Gender:</b> {selectedWorker.gender || "N/A"}
                </p>
                <p>
                  <b>Email:</b> {selectedWorker.email || "N/A"}
                </p>
                <p>
                  <b>Phone:</b> {selectedWorker.phone || "N/A"}
                </p>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setSelectedWorker(null)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-pink-600 text-white font-semibold shadow-md hover:scale-105 transform transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
