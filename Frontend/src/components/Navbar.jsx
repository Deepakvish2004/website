import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar({ user, logout }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [tick, setTick] = useState(0);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r rounded-lg from-violet-200 to-indigo-200 backdrop-blur-md bg-opacity-80 shadow-lg p-4 flex justify-between items-center transition-all duration-300">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="Hand Logo"
            className="h-12 w-12 rounded-full shadow-md group-hover:scale-105 transition-transform"
          />
          <span className="font-bold text-2xl text-violet-900 tracking-wide group-hover:text-violet-700 transition">
            Hand
          </span>
        </Link>

        {!user && (
          <Link
            to="/services"
            className="text-violet-900 text-sm font-medium hover:text-violet-600 transition"
          >
            Services
          </Link>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {!user && (
          <>
            {/* Login Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-full 
                  bg-white text-violet-700 shadow-md hover:shadow-lg
                  hover:bg-violet-600 hover:text-white transition-all duration-200"
              >
                Login
                <span
                  className={`transform transition-transform duration-200 ${
                    openDropdown ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▾
                </span>
              </button>

              {openDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden animate-fadeIn z-50">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 transition"
                    onClick={() => setOpenDropdown(false)}
                  >
                    👤 User Login
                  </Link>
                  <Link
                    to="/worker/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 transition"
                    onClick={() => setOpenDropdown(false)}
                  >
                    🛠 Worker Login
                  </Link>
                  <Link
                    to="/admin/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 transition"
                    onClick={() => setOpenDropdown(false)}
                  >
                    🔑 Admin Login
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/register"
              className="text-sm font-semibold px-4 py-2 rounded-full 
                bg-white text-violet-700 shadow-md hover:shadow-lg
                hover:bg-violet-600 hover:text-white transition-all duration-200"
            >
              Register
            </Link>
          </>
        )}

        {/* Logged-in User or Worker */}
        {user && (user.role === "user" || user.role === "worker") && (
          <div className="flex items-center gap-3">
            {/* Name Badge */}
            <span className="text-sm font-medium px-3 py-1 bg-violet-100 text-violet-900 rounded-full shadow-sm">
              Hello, {user.name}
            </span>

            {user.role === "user" && (
              <Link
                to="/dashboard"
                className="text-sm font-semibold px-4 py-2 rounded-full 
                  bg-white text-violet-700 shadow-md hover:shadow-lg
                  hover:bg-violet-600 hover:text-white transition"
              >
                My Bookings
              </Link>
            )}

            {user.role === "worker" && (
              <Link
                to="/worker/dashboard"
                className="text-sm font-semibold px-4 py-2 rounded-full 
                  bg-white text-violet-700 shadow-md hover:shadow-lg
                  hover:bg-violet-600 hover:text-white transition"
              >
                My Tasks
              </Link>
            )}

            {/* Logout button */}
            <button
              onClick={logout}
              className="text-sm font-semibold px-4 py-2 rounded-full 
                bg-white text-red-700 shadow-md hover:shadow-lg
                hover:bg-red-600 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        )}

        {/* Admin Links */}
        {user && user.role === "admin" && (
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="text-sm font-semibold px-4 py-2 rounded-full 
                bg-white text-violet-700 shadow-md hover:shadow-lg
                hover:bg-violet-600 hover:text-white transition"
            >
              Admin
            </Link>
            <Link
              to="/admin/workers"
              className="text-sm font-semibold px-4 py-2 rounded-full 
                bg-white text-violet-700 shadow-md hover:shadow-lg
                hover:bg-violet-600 hover:text-white transition"
            >
              Create Worker
            </Link>

            {/* Logout button for Admin */}
            <button
              onClick={logout}
              className="text-sm font-semibold px-4 py-2 rounded-full 
                bg-white text-red-700 shadow-md hover:shadow-lg
                hover:bg-red-600 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
