import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, logout }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
    <nav className="bg-gradient-to-r from-violet-300  border-5 border-violet-600 hover:border-black rounded-lg to-indigo-300 shadow-md p-4 flex justify-between items-center relative">
      {/* Left Side */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="font-extrabold text-2xl text-white tracking-wide hover:text-green-300 transition"
        >
          Hand Services
        </Link>
        <Link
          to="/services"
          className="text-white text-sm hover:text-yellow-800 transition "
        >
          Services
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {!user && (
          <div className="relative" ref={dropdownRef}>
            {/* Dropdown trigger */}
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-full 
                bg-white text-violet-700 border-2 border-violet-600 shadow-md
                hover:bg-violet-600 hover:text-white transition duration-200"
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

            {/* Dropdown menu (toggle only) */}
            {openDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fadeIn z-50">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-100"
                  onClick={() => setOpenDropdown(false)}
                >
                  👤 User Login
                </Link>
                <Link
                  to="/worker/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-100"
                  onClick={() => setOpenDropdown(false)}
                >
                  🛠 Worker Login
                </Link>
                <Link
                  to="/admin/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-100"
                  onClick={() => setOpenDropdown(false)}
                >
                  🔑 Admin Login
                </Link>
              </div>
            )}
          </div>
        )}

        {!user && (
          <Link
            to="/register"
            className="text-sm font-semibold px-4 py-2 rounded-full 
              bg-white text-violet-700 border-2 border-violet-600 shadow-md
              hover:bg-violet-600 hover:text-white transition duration-200"
          >
            Register
          </Link>
        )}

        {user && (
          <>
            <Link
              to="/dashboard"
              className="text-sm font-semibold px-4 py-2 rounded-full 
                bg-white text-violet-700 border-2 border-violet-600 shadow-md
                hover:bg-violet-600 hover:text-white transition"
            >
              My Bookings
            </Link>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="text-sm font-semibold px-4 py-2 rounded-full 
                  bg-white text-violet-700 border-2 border-violet-600 shadow-md
                  hover:bg-violet-600 hover:text-white transition"
              >
                Admin
              </Link>
            )}
            <button
              onClick={logout}
              className="text-sm font-semibold px-4 py-2 rounded-full 
                bg-white text-red-700 border-2 border-red-600 shadow-md
                hover:bg-red-600 hover:text-white transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
