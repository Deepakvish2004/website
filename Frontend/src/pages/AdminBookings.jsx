  import React, { useEffect, useState } from "react";
  import API from "../api/axios";
  import { useNavigate } from "react-router-dom";

  export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load bookings and active workers
    const loadData = async () => {
      setLoading(true);
      try {
        const [bRes, wRes] = await Promise.all([
          API.get("/bookings"),
          API.get("/workers?active=true"),
        ]);
        setBookings(bRes.data.items ? bRes.data.items : bRes.data);
        setWorkers(wRes.data);
      } catch (err) {
        console.error("Failed to load data:", err);
        alert("Failed to load bookings or workers");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadData();
    }, []);

    // Assign a worker
    const assignWorker = async (bookingId, workerId, workerName, service) => {
      if (!workerId) return;
      if (
        !window.confirm(
          `Assign ${workerName} to ${service}? This will mark status as "assigned".`
        )
      )
        return;
      try {
        await API.patch(`/bookings/${bookingId}/assign`, { workerId });
        await loadData();
      } catch (err) {
        console.error(err);
        alert("Failed to assign worker");
      }
    };

    // Unassign a worker
    const unassignWorker = async (bookingId) => {
      if (!window.confirm("Unassign worker from this booking?")) return;
      try {
        await API.patch(`/bookings/${bookingId}/unassign`);
        await loadData();
      } catch (err) {
        alert("Failed to unassign worker");
      }
    };

    // Show available services
    const showServices = () => {
      const uniqueServices = [...new Set(bookings.map((b) => b.service))];
      if (uniqueServices.length === 0) {
        alert("No services found in bookings.");
        return;
      }
      alert("Available Services:\n\n" + uniqueServices.join(", "));
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
      <div className="p-6 bg-gradient-to-r rounded-4xl from-blue-600 to-purple-600 min-h-screen relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="px-3 py-1 bg-white text-blue-700 font-semibold rounded hover:bg-gray-100 transition flex items-center gap-1"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-white">📋 Admin - Bookings</h1>
        </div>

        {/* Summary */}
        <div className="mb-6 flex gap-8 text-white items-center">
          <h2 className="text-lg">
            Total Bookings: <b>{bookings.length}</b>
          </h2>
          <h2 className="text-lg">
            Available Workers: <b>{workers.length}</b>
          </h2>
          <button
            onClick={showServices}
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-500 transition"
          >
            🔍 Check Available Services
          </button>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3">Booking ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Service</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned Worker</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const eligibleWorkers = workers.filter((w) =>
                  w.services.includes(b.service)
                );

                return (
                  <tr key={b._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 font-mono text-gray-600">
                      {b._id.slice(-6)}
                    </td>
                    <td className="p-3">
                      {b.user?.name}{" "}
                      <span className="text-gray-500">({b.user?.email})</span>
                      <span className="text-gray-500">({b.name})</span>
                  <b>    <span className="text-gray-500">({b.details})</span></b>
                    </td>
                    <td className="p-3 font-semibold">{b.service}</td>
                    <td className="p-3">
                      {new Date(b.bookingDate).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          b.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : b.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : b.status === "assigned"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {b.assignedWorker ? (
                        <span className="font-medium text-blue-700">
                          {b.assignedWorker.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not Assigned</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        {b.status === "pending" ? (
                          <span className="text-yellow-700 font-semibold">
                            ⏳ Wait for assigning
                          </span>
                        ) : b.status === "assigned" ? (
                          eligibleWorkers.length > 0 ? (
                            <select
                              className="border px-2 py-1 rounded bg-gray-50"
                              defaultValue=""
                              onChange={(e) => {
                                const worker = eligibleWorkers.find(
                                  (w) => w._id === e.target.value
                                );
                                assignWorker(
                                  b._id,
                                  e.target.value,
                                  worker?.name,
                                  b.service
                                );
                              }}
                            >
                              <option value="">Assign worker...</option>
                              {eligibleWorkers.map((w) => {
                                const isBusy = bookings.some(
                                  (other) =>
                                    other._id !== b._id &&
                                    other.assignedWorker?._id === w._id &&
                                    ["assigned", "confirmed"].includes(other.status) && // ✅ skip completed/cancelled
                                    new Date(other.bookingDate).toDateString() ===
                                      new Date(b.bookingDate).toDateString()
                                );

                                return (
                                  <option
                                    key={w._id}
                                    value={w._id}
                                    disabled={isBusy}
                                  >
                                    {w.name} {isBusy ? " (Busy)" : ""}
                                  </option>
  );

                                return (
                                  <option
                                    key={w._id}
                                    value={w._id}
                                    disabled={isBusy}
                                  >
                                    {w.name} {isBusy ? " (Busy)" : ""}
                                  </option>
                                );
                              })}
                            </select>
                          ) : (
                            <span className="text-red-500 font-medium">
                              ⚠ No eligible worker
                            </span>
                          )
                        ) : b.status === "confirmed" ? (
                          <span className="text-green-700 font-semibold">
                            Assigned
                          </span>
                        ) : (
                          <span className="text-red-700 font-semibold">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Floating Back Button */}
        <button
          onClick={() => navigate("/admin")}
          className="fixed bottom-6 right-6 px-4 py-3 bg-white text-blue-700 font-bold rounded-full shadow-lg hover:bg-gray-100 transition text-xl"
          title="Go Back"
        >
          ←
        </button>
      </div>
    );
  }
