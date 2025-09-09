import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import BookingPage from './pages/BookingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminBookings from './pages/AdminBookings';
import WorkerLogin from "./pages/WorkerLogin";
import WorkerDashboard from "./pages/WorkerDashboard";
import AdminWorkers from "./pages/AdminWorkers";
import AdminLogin from "./pages/AdminLogin";

import Navbar from './components/Navbar';
import AdminReports from "./pages/AdminReports";




function getUserFromStorage() {
  
  try {
    const data = localStorage.getItem('user');
    if (!data || data === "undefined") return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function App() {
  const user = getUserFromStorage();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div>
      <div>
      {/* navbar */}
      <Navbar user={user} logout={logout} />
      </div>


      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/services" element={<Services/>} />
          <Route path="/book/:service?" element={<BookingPage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard/></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard/></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><AdminBookings/></ProtectedRoute>} />
           {/* Worker side */}
  <Route path="/worker/login" element={<WorkerLogin />} />
  <Route path="/worker/dashboard" element={<WorkerDashboard />} />
  <Route path="/admin/workers" element={<AdminWorkers />} />

  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
  <Route path="/admin/reports" element={<AdminReports />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
