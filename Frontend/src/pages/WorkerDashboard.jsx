import { useEffect, useState } from "react";
import API from "../api/axios";

export default function WorkerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllAssignments, setShowAllAssignments] = useState(false);
  const [worker, setWorker] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [active, setActive] = useState(true); // ✅ worker active status

  // Load worker from local storage
  useEffect(() => {
    const storedWorker = localStorage.getItem("worker");
    if (storedWorker) setWorker(JSON.parse(storedWorker));
  }, []);

  // Fetch bookings assigned to worker
  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/workers/my-bookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("workerToken")}` },
      });
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle worker active/inactive status
  const toggleActiveStatus = async () => {
    try {
      const { data } = await API.patch(
        "/workers/toggle-active",
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("workerToken")}` } }
      );
      setActive(data.active);
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update booking status (completed / cancelled)
  const updateStatus = async (id, status) => {
    try {
      await API.patch(
        `/workers/my-bookings/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("workerToken")}` } }
      );
      fetchBookings();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };
  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("worker");
    localStorage.removeItem("workerToken");
    window.location.href = "/worker/login"; // redirect to worker login page
  };

  const displayedBookings = showAllAssignments
    ? bookings
    : bookings.filter((b) => b.status !== "completed");

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i + 1 <= rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-lg">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="min-h-screen  shadow-lg rounded-lg flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col items-center py-8 shadow-lg">
        <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
          {worker?.name ? worker.name.charAt(0).toUpperCase() : "W"}
        </div>
        <h2 className="text-xl font-semibold">{worker?.name || "Worker"}</h2>
        <p className="text-sm text-gray-300 mb-4">Service Provider</p>

       {/* Active/Inactive toggle */}
<div
  onClick={toggleActiveStatus}
  className={`relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 
    ${active ? "bg-green-500" : "bg-red-500"}`}
>
  {/* Circle that slides */}
  <div
    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 
      ${active ? "translate-x-8" : "translate-x-0"}`}
  ></div>

  {/* Label (optional) */}
  <span className="absolute left-20 text-sm font-medium select-none">
    {active ? "Online" : "Offline"}
  </span>
</div>

        {/* Show bookings toggle */}
        <button
          onClick={() => setShowAllAssignments(!showAllAssignments)}
          className="py-2 px-4 m-3 bg-indigo-500 rounded hover:bg-indigo-600 transition"
        >
          {showAllAssignments ? "Show New Only" : "My Assignments"}
        </button>
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="py-2 px-4 mt-4 bg-red-500 rounded hover:bg-red-600 transition text-white font-semibold"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-100">
        <div className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white">
          <h1 className="text-3xl font-bold mb-6">
            👷 {showAllAssignments ? "All Assigned Bookings" : "New Assignments"}
          </h1>

          {displayedBookings.length === 0 ? (
            <div className="text-center py-12 text-white">
              <p className="text-lg">
                {showAllAssignments ? "No bookings assigned yet 🚫" : "No new assignments 🎉"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white text-gray-800 rounded-lg shadow p-4">
              <table className="min-w-full text-sm rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="p-3">Service</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedBookings.map((b) => (
                    <tr
                      key={b._id}
                      className={`border-b hover:bg-gray-100 cursor-pointer ${
                        b.status === "completed"
                          ? "bg-green-100 font-semibold"
                          : b.status === "pending" && !showAllAssignments
                          ? "bg-yellow-100 font-semibold"
                          : ""
                      }`}
                      onClick={() => setSelectedBooking(b)}
                    >
                      <td className="p-3">{b.service}</td>
                      <td className="p-3">{new Date(b.bookingDate).toLocaleString()}</td>
                      <td className="p-3 font-semibold">{b.name ?? "N/A"}</td>
                      <td className="p-3">{b.address ?? "N/A"}</td>
                      <td className="p-3">{b.phone ?? "N/A"}</td>
                      <td
                        className={`p-3 font-semibold ${
                          b.status === "completed"
                            ? "text-green-800"
                            : b.status === "cancelled"
                            ? "text-red-700"
                            : b.status === "pending"
                            ? "text-yellow-700"
                            : ""
                        }`}
                      >
                        {b.status}
                      </td>
                      <td className="p-3">
                        {b.feedback?.rating ? renderStars(b.feedback.rating) : "—"}
                      </td>
                      <td className="p-3 flex gap-2 flex-wrap">
                        {b.status !== "completed" && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(b._id, "completed");
                              }}
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                            >
                              Mark as Done
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(b._id, "cancelled");
                              }}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="relative bg-white rounded-2xl p-6 w-[500px] shadow-2xl">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
              onClick={() => setSelectedBooking(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">📋 Booking Details</h2>
            <div className="space-y-2 text-gray-700">
              <p><b>Service:</b> {selectedBooking.service}</p>
              <p><b>Customer:</b> {selectedBooking.name}</p>
              <p><b>Phone:</b> {selectedBooking.phone}</p>
              <p><b>Address:</b> {selectedBooking.address}</p>
              <p><b>Date:</b> {new Date(selectedBooking.bookingDate).toLocaleString()}</p>
              <p className="uppercase">
                <b>Status:</b>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold ${
                    selectedBooking.status === "completed"
                      ? "bg-green-700"
                      : selectedBooking.status === "cancelled"
                      ? "bg-red-700"
                      : selectedBooking.status === "pending"
                      ? "bg-yellow-600"
                      : "bg-gray-500"
                  }`}
                >
                  {selectedBooking.status}
                </span>
              </p>

              {selectedBooking.feedback && (
                <>
                  <p><b>Rating:</b> {renderStars(selectedBooking.feedback.rating)}</p>
                  <p><b>Review:</b> {selectedBooking.feedback.review || "—"}</p>
                </>
              )}
            </div>

            {selectedBooking.address && (
              <div className="mt-4">
                <iframe
                  title="map"
                  width="100%"
                  height="200"
                  className="rounded-lg"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    selectedBooking.address
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <div className="mt-4 flex justify-center gap-3 flex-wrap">
              {selectedBooking.status !== "completed" &&
                selectedBooking.status !== "cancelled" && (
                  <>
                    <button
                      onClick={() => {
                        updateStatus(selectedBooking._id, "completed");
                        setSelectedBooking(null);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                    >
                      Mark as Done
                    </button>
                    <button
                      onClick={() => {
                        updateStatus(selectedBooking._id, "cancelled");
                        setSelectedBooking(null);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </>
                )}

              <button
                onClick={() => alert("Chat functionality coming soon!")}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600"
              >
                Chat with Customer
              </button>

              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
