import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import WorkerRegistration from "./pages/WorkerRegistration";
import AboutPage from './components/Aboutpage';
import ContactPage from './components/ContactPage';
import AdminContacts from "./pages/AdminContacts";

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
      {/* Navbar with user info */}
      <Navbar user={user} logout={logout} />

      <main className="container mx-auto p-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          {/* ✅ Pass user to Services so it can redirect correctly */}
          <Route path="/services" element={<Services user={user} />} />
          
          {/* Booking route protected - cannot access if not logged in */}
          <Route 
            path="/book/:service?" 
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User dashboard (protected) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin dashboard & routes (protected + adminOnly) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <ProtectedRoute adminOnly>
                <AdminBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/workers" 
            element={
              <ProtectedRoute adminOnly>
                <AdminWorkers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute adminOnly>
                <AdminReports />
              </ProtectedRoute>
            } 
          />

          
            <Route path="/admin/contacts" element={<AdminContacts />} />
          {/* Worker routes (optional protection if needed later) */}
          <Route path="/worker/login" element={<WorkerLogin />} />
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route path="/worker/register" element={<WorkerRegistration />} />
          

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />


          {/* Admin login (public) */}
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
