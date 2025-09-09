import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings"); // bookings | workers
  const navigate = useNavigate();

  // Fetch Bookings
  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/bookings");
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Workers
  const fetchWorkers = async () => {
    try {
      const { data } = await API.get("/workers");
      setWorkers(data);
    } catch (err) {
      console.error("Error fetching workers:", err);
      alert("Failed to load workers");
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchWorkers();
  }, []);

  // Booking Status Change
  const changeStatus = async (id, status) => {
    try {
      await API.patch(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Delete Booking
  const delBooking = async (id) => {
    if (!window.confirm("Delete booking?")) return;
    try {
      await API.delete(`/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      alert("Failed to delete booking");
    }
  };

  // ✅ Unassign Worker
  const unassignWorker = async (id) => {
    if (!window.confirm("Unassign worker from this booking?")) return;
    try {
      await API.patch(`/bookings/${id}/unassign`);
      fetchBookings();
    } catch (err) {
      alert("Failed to unassign worker");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login", { replace: true });
  };

  const filteredBookings = bookings.filter((b) => {
    const s = searchTerm.toLowerCase();
    return (
      b.service?.toLowerCase().includes(s) ||
      b.user?.name?.toLowerCase().includes(s) ||
      b.user?.email?.toLowerCase().includes(s) ||
      b.address?.toLowerCase().includes(s)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen border-5 rounded-lg bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gray-600 rounded-full"></div>
          <h2 className="mt-2 font-semibold">Admin Panel</h2>
        </div>
        <nav className="space-y-2">
          <button
            onClick={() => {
              setActiveTab("bookings");
              navigate("/admin/bookings");
            }}
            className={`w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
              activeTab === "bookings" ? "bg-gray-700" : ""
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab("workers")}
            className={`w-full text-left px-4 py-2 rounded hover:bg-gray-700 ${
              activeTab === "workers" ? "bg-gray-700" : ""
            }`}
          >
            Worker Management
          </button>
          <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700">
           <ul
  onClick={() => navigate("/admin/reports")}
  className=""
>
  Reports
</ul>

          </button>
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-6"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {/* BOOKING SECTION */}
        {activeTab === "bookings" && (
          <>
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              View Bookings
            </h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="p-6 rounded-xl shadow text-white bg-gradient-to-r from-green-400 to-green-600">
                <h2 className="text-lg font-semibold">Confirmed</h2>
                <p className="text-3xl font-bold">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </p>
              </div>
              <div className="p-6 rounded-xl shadow text-white bg-gradient-to-r from-yellow-400 to-yellow-600">
                <h2 className="text-lg font-semibold">Pending</h2>
                <p className="text-3xl font-bold">
                  {bookings.filter((b) => b.status === "pending").length}
                </p>
              </div>
              <div className="p-6 rounded-xl shadow text-white bg-gradient-to-r from-red-400 to-red-600">
                <h2 className="text-lg font-semibold">Cancelled</h2>
                <p className="text-3xl font-bold">
                  {bookings.filter((b) => b.status === "cancelled").length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10">
              {/* Table */}
              <div className="col-span-2 bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Bookings</h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-2">S.No</th>
                      <th className="p-2">Service</th>
                      <th className="p-2">User</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b, i) => (
                      <tr key={b._id} className="border-b">
                        <td className="p-2">{i + 1}</td>
                        <td className="p-2">{b.service}</td>
                        <td className="p-2">{b.name ?? "N/A"}</td>
                        <td className="p-2 font-semibold capitalize">
                          {b.status}
                        </td>
                        <td className="p-2 space-x-2">
                          {b.status === "pending" && (
                            <>
                              <button
                                onClick={() => changeStatus(b._id, "assigned")}
                                className="px-2 py-1 bg-green-500 text-white rounded-lg text-sm"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => changeStatus(b._id, "cancelled")}
                                className="px-2 py-1 bg-yellow-500 text-white rounded text-sm"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {/* ✅ Show Unassign button if worker assigned */}
                          {b.assignedWorker && (
                            <button
                              onClick={() => unassignWorker(b._id)}
                              className={`px-2 py-1 text-white rounded text-sm ${
                                b.status === "confirmed"
                                  ? "bg-red-500 hover:bg-red-600"
                                  : b.status === "completed"
                                  ? "bg-green-500 hover:bg-blue-600"
                                  : "bg-blue-500 hover:bg-purple-600"
                              }`}
                            >
                              Unassign
                            </button>
                          )}

                          <button
                            onClick={() => delBooking(b._id)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Side panel */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-semibold mb-2">Search Booking</h2>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 mb-4 border rounded"
                />
              </div>
            </div>
          </>
        )}

        {/* WORKER MANAGEMENT SECTION */}
        {activeTab === "workers" && (
          <>
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 text-transparent bg-clip-text">
              Worker Management
            </h1>

            {/* Summary Cards for Workers */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="p-6 rounded-xl shadow text-white bg-gradient-to-r from-indigo-400 to-indigo-600">
                <h2 className="text-lg font-semibold">Total Workers</h2>
                <p className="text-3xl font-bold">{workers.length}</p>
              </div>
              <div className="p-6 rounded-xl shadow text-white bg-gradient-to-r from-green-400 to-green-600">
                <h2 className="text-lg font-semibold">Active</h2>
                <p className="text-3xl font-bold">
                  {workers.filter((w) => w.status === "active").length}
                </p>
              </div>
              <div className="p-6 rounded-xl shadow text-white bg-gradient-to-r from-red-400 to-red-600">
                <h2 className="text-lg font-semibold">Blocked</h2>
                <p className="text-3xl font-bold">
                  {workers.filter((w) => w.status === "blocked").length}
                </p>
              </div>
            </div>

            {/* Worker Table */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4">All Workers</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2">S.No</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Services Known</th>
                    <th className="p-2">Age</th>
                    <th className="p-2">Gender</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((w, i) => (
                    <tr key={w._id} className="border-b">
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2">{w.name}</td>
                      <td className="p-2">{w.email}</td>
                      <td className="p-2 capitalize">
                        {Array.isArray(w.services) && w.services.length > 0
                          ? w.services.join(", ")
                          : w.service ?? "Not Assigned"}
                      </td>
                      <td className="p-2">{w.age ?? "N/A"}</td>
                      <td className="p-2">{w.gender ?? "N/A"}</td>
                      <td
                        className={`p-2 font-semibold ${
                          w.active ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {w.active ? "Active" : "Inactive"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
