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
  const [name, setName] = useState("");
const [email, setEmail] = useState("");


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
  // ✅ Load Admin Profile (from localStorage OR API)
  const fetchAdminProfile = async () => {
    try {
      // Check if we stored admin details in localStorage after login
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setName(parsed.name || "Admin");
        setEmail(parsed.email || "");
      } else {
        // Fallback: Call backend API (optional)
        const { data } = await API.get("/admin/me");
        setName(data.name || "Admin");
        setEmail(data.email || "");
      }
    } catch (err) {
      console.error("Failed to fetch admin profile:", err);
    }
  };


  useEffect(() => {
    fetchBookings();
    fetchWorkers();
    fetchAdminProfile();
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <div className="text-center mb-8">
          {/* Avatar */}
          <div className="w-20 h-20 mx-auto bg-gray-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {name ? name.charAt(0).toUpperCase() : "A"}
          </div>
          {/* Show Admin Name */}
          <h2 className="mt-2 font-semibold">{name || "Admin Panel"}</h2>
          <p className="text-sm text-gray-300">{email}</p>
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
                      <th className="p-2">Phone</th>
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
                        <td className="p-2">{b.phone ?? "N/A"}</td>
                        <td className="p-2 font-semibold capitalize">
  <span
    className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${
      b.status === "pending"
        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
        : b.status === "assigned"
        ? "bg-blue-100 text-blue-800 border-blue-300"
        : b.status === "confirmed"
        ? "bg-green-100 text-green-800 border-green-300"
        : b.status === "completed"
        ? "bg-purple-100 text-purple-800 border-purple-300"
        : b.status === "cancelled"
        ? "bg-red-100 text-red-800 border-red-300"
        : "bg-gray-100 text-gray-800 border-gray-300"
    }`}
  >
    {b.status}
  </span>
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
          {workers.filter((w) => w.active === true).length}
        </p>
      </div>
      <div className="p-6 rounded-xl shadow text-white bg-gradient-to-r from-red-400 to-red-600">
        <h2 className="text-lg font-semibold">Inactive</h2>
        <p className="text-3xl font-bold">
          {workers.filter((w) => w.active === false).length}
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
            <th className="p-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((w, i) => (
            <tr key={w._id} className="border-b hover:bg-gray-50">
              <td className="p-2">{i + 1}</td>
              <td className="p-2 font-semibold">{w.name}</td>
              <td className="p-2">{w.email}</td>
              <td className="p-2">
                {Array.isArray(w.services) && w.services.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {w.services.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 italic">Not Assigned</span>
                )}
              </td>
              <td className="p-2">{w.age ?? "N/A"}</td>
              <td className="p-2 capitalize">{w.gender ?? "N/A"}</td>
              <td className="p-2 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    w.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {w.active ? "Active" : "Inactive"}
                </span>
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
