import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-8 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        
        
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h2 className="text-2xl font-bold">HelperHand Services</h2>
          <p className="text-sm text-gray-300 mt-2">
            Reliable helpers, cleaners, and washing services at your doorstep.
          </p>
        </div>

        
        <div className="flex space-x-6 text-sm mb-6 md:mb-0">
          <Link to="/" className="hover:text-yellow-400 transition">
            Home
          </Link>
          <Link to="/services" className="hover:text-yellow-400 transition">
            Services
          </Link>
          <Link to="/about" className="hover:text-yellow-400 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-yellow-400 transition">
            Contact
          </Link>
        </div>

        <div className="text-center md:text-right">
          <Link
            to="/register"
            className="px-5 py-2 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-500 transition"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
        {new Date().getFullYear()} HelperHand Services. All Rights Reserved.
      </div>
    </footer>
  );
}
