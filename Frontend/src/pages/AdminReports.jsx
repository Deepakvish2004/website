// src/pages/AdminReports.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";
import Calendar from "react-calendar"; // npm install react-calendar
import "react-calendar/dist/Calendar.css";

export default function AdminReports() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/bookings");
      setBookings(data.items ? data.items : data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length;
  const assignedBookings = bookings.filter((b) => b.status === "assigned").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;

  // Unique Users
  const uniqueUsers = Array.from(new Set(bookings.map((b) => b.user?.email || b.email)));
  const totalUsers = uniqueUsers.length;

  const userNames = Array.from(new Set(bookings.map((b) => b.user?.name || b.name || "N/A")));

  // Safe date parsing
  const parseDate = (dateValue) => {
    if (!dateValue) return null;
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  // Rating color helper
  const getRatingColor = (rating) => {
    switch (rating) {
      case 5:
        return "bg-green-500 text-white";
      case 4:
        return "bg-green-300 text-black";
      case 3:
        return "bg-yellow-400 text-black";
      case 2:
        return "bg-orange-400 text-white";
      case 1:
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-black"; // no rating
    }
  };

  // Calendar color logic
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    const dayBookings = bookings.filter((b) => {
      const d = parseDate(b.bookingDate);
      return d && d.toDateString() === date.toDateString();
    });

    if (dayBookings.length > 0) {
      if (dayBookings.some((b) => b.status === "confirmed"))
        return "bg-green-400 text-white rounded-full";
      if (dayBookings.some((b) => b.status === "cancelled"))
        return "bg-red-400 text-white rounded-full";
      if (dayBookings.some((b) => b.status === "assigned"))
        return "bg-blue-400 text-white rounded-full";
      return "bg-yellow-300 text-black rounded-full"; // pending
    }
    return null;
  };

  // Filter bookings by selected date
  const bookingsForSelectedDate = bookings.filter((b) => {
    const d = parseDate(b.bookingDate);
    return d && d.toDateString() === selectedDate.toDateString();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-lg">
        Loading Reports...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Stats */}
      <div className="grid grid-cols-6 gap-6 mb-8">
        <div className="bg-blue-500 text-white rounded-2xl shadow p-6">
          <h2 className="text-lg">Total Bookings</h2>
          <p className="text-3xl font-bold">{totalBookings}</p>
        </div>
        <div className="bg-yellow-500 text-white rounded-2xl shadow p-6">
          <h2 className="text-lg">Pending</h2>
          <p className="text-3xl font-bold">{pendingBookings}</p>
        </div>
        <div className="bg-blue-500 text-white rounded-2xl shadow p-6">
          <h2 className="text-lg">Assigned</h2>
          <p className="text-3xl font-bold">{assignedBookings}</p>
        </div>
        <div className="bg-green-500 text-white rounded-2xl shadow p-6">
          <h2 className="text-lg">Confirmed</h2>
          <p className="text-3xl font-bold">{confirmedBookings}</p>
        </div>
        <div className="bg-red-500 text-white rounded-2xl shadow p-6">
          <h2 className="text-lg">Cancelled</h2>
          <p className="text-3xl font-bold">{cancelledBookings}</p>
        </div>
        <div className="bg-purple-500 text-white rounded-2xl shadow p-6">
          <h2 className="text-lg">Total Users</h2>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </div>
      </div>

      {/* Availability Calendar */}
      <div className="relative shadow-xl rounded-2xl p-8 mb-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#6366f1,_#8b5cf6,_#ec4899,_#10b981)] opacity-90 rounded-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-extrabold mb-6 tracking-wide text-center uppercase drop-shadow-lg">
            Availability Calendar
          </h2>
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            tileClassName={tileClassName}
            className="mx-auto rounded-lg shadow-lg p-3 bg-white text-black"
          />

          {/* Bookings for selected date */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3 drop-shadow">
              Bookings on {selectedDate.toDateString()}:
            </h3>
            {bookingsForSelectedDate.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse mt-3 bg-white/90 backdrop-blur-md text-black rounded-xl shadow-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-left">
                      <th className="p-3">Customer</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingsForSelectedDate.map((b) => (
                      <tr
                        key={b._id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition"
                      >
                        <td className="p-3">{b.name || b.user?.name || "N/A"}</td>
                        <td className="p-3">{b.user?.email || "N/A"}</td>
                        <td className="p-3">{b.phone || "N/A"}</td>
                        <td className="p-3">{b.service}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-white font-semibold ${
                              b.status === "confirmed"
                                ? "bg-green-500"
                                : b.status === "cancelled"
                                ? "bg-red-500"
                                : b.status === "assigned"
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className={`p-3`}>
                          <span className={`px-2 py-1 rounded-full font-semibold ${getRatingColor(b.feedback?.rating)}`}>
                            {b.feedback?.rating ? `⭐ ${b.feedback.rating}` : "—"}
                          </span>
                        </td>
                        <td className="p-3">{b.feedback?.review || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-200 italic mt-3">No bookings on this date</p>
            )}
          </div>
        </div>
      </div>

      {/* Full Bookings Table */}
      <div className="mt-10 bg-green-600 p-6 rounded-2xl shadow-xl bg-gradient-to-r from-green-400 to-blue-700 ">
        <div className="bg-white shadow rounded-2xl p-6 mb-8 overflow-x-auto">
          <h2 className="text-lg font-bold mb-4">All Booking Details</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-300 text-left">
                <th className="p-2">Booking ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Service</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Rating</th>
                <th className="p-2">Review</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const d = parseDate(b.bookingDate);
                const gradientColor =
                  b.status === "confirmed"
                    ? "radial-gradient(circle, #34d399, #10b981)"
                    : b.status === "cancelled"
                    ? "radial-gradient(circle, #f87171, #ef4444)"
                    : b.status === "assigned"
                    ? "radial-gradient(circle, #60a5fa, #3b82f6)"
                    : "radial-gradient(circle, #facc15, #eab308)";
                return (
                  <tr key={b._id} className="border-b">
                    <td className="p-2">{b._id.slice(-6)}</td>
                    <td className="p-2">{b.user?.name || b.name || "N/A"}</td>
                    <td className="p-2">{b.service}</td>
                    <td className="p-2">{d ? d.toLocaleDateString() : "Invalid Date"}</td>
                    <td className="p-2">
                      <span
                        className="px-3 py-1 rounded-full text-white"
                        style={{ background: gradientColor }}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className={`p-2`}>
                      <span className={`px-2 py-1 rounded-full font-semibold ${getRatingColor(b.feedback?.rating)}`}>
                        {b.feedback?.rating ? `⭐ ${b.feedback.rating}` : "—"}
                      </span>
                    </td>
                    <td className="p-2">{b.feedback?.review || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 shadow-2xl rounded-2xl p-8 mt-10 text-white">
        <h2 className="text-2xl font-extrabold mb-6 tracking-wide text-center uppercase">
          Users
        </h2>
        <ul className="space-y-3">
          {userNames.map((u, idx) => (
            <li
              key={idx}
              className="p-3 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 ease-in-out text-lg font-medium tracking-wide"
            >
              {u}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
