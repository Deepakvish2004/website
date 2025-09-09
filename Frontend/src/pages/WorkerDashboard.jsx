import { useEffect, useState } from "react";
import API from "../api/axios";

export default function WorkerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllAssignments, setShowAllAssignments] = useState(false);

  const [worker, setWorker] = useState(null);

  useEffect(() => {
    // Load worker from localStorage
    const storedWorker = localStorage.getItem("worker");
    if (storedWorker) {
      setWorker(JSON.parse(storedWorker));
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/workers/my-bookings");
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/workers/my-bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-lg">
        Loading bookings...
      </div>
    );
  }

  // Hide completed bookings for default "New Assignments" view
  const displayedBookings = showAllAssignments
    ? bookings
    : bookings.filter((b) => b.status !== "completed");

  return (
    <div className="min-h-screen border-5 border-purple-500 rounded-lg bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col items-center py-8 shadow-lg">
        <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
          D
        </div>
        <h2 className="text-xl font-semibold">Deep</h2>
        <p className="text-sm text-gray-300 mb-8">Service Provider</p>

        <button
          onClick={() => setShowAllAssignments(!showAllAssignments)}
          className="py-2 px-4 bg-indigo-500 rounded hover:bg-indigo-600 transition"
        >
          {showAllAssignments ? "Show New Only" : "My Assignments"}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white">
          <h1 className="text-3xl font-bold mb-6">
            👷 {showAllAssignments ? "All Assigned Bookings" : "New Assignments"}
          </h1>

          {displayedBookings.length === 0 ? (
            <div className="text-center py-12 text-white">
              <p className="text-lg">
                {showAllAssignments
                  ? "No bookings assigned yet 🚫"
                  : "No new assignments 🎉"}
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
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedBookings.map((b) => (
                    <tr
                      key={b._id}
                      className={`border-b hover:bg-gray-100 ${
                        b.status === "completed"
                          ? "bg-green-100 font-semibold"
                          : b.status === "pending" && !showAllAssignments
                          ? "bg-yellow-100 font-semibold"
                          : ""
                      }`}
                    >
                      <td className="p-3">{b.service}</td>
                      <td className="p-3">{new Date(b.bookingDate).toLocaleString()}</td>
                      <td className="p-3 font-semibold">{b.name ?? "N/A"}</td>
                      <td className="p-3">{b.address ?? "N/A"}</td>
                      <td className="p-3">{b.phone ?? "N/A"}</td>
                      <td className="p-3 font-semibold">{b.status}</td>
                      <td className="p-3 flex gap-2 flex-wrap">
                        {b.status !== "completed" && (
                          <button
                            onClick={() => updateStatus(b._id, "completed")}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                          >
                            Mark as Done
                          </button>
                        )}
                        {b.status !== "completed" && (
                          <button
                            onClick={() => updateStatus(b._id, "cancelled")}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
                          >
                            Cancel
                          </button>
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
    </div>
  );
}
