import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); // ✅ check login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    // ✅ Restrict message sending if user is NOT logged in
    if (!isLoggedIn) {
      toast.error("⚠️ Please log in to send a message.");
      navigate("/login"); // optional: redirect to login page
      return;
    }

    setLoading(true);

    try {
      await API.post("/contact", formData);
      setSuccess("✅ Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setSuccess("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex rounded-lg flex-col items-center justify-between bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Contact Form Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-lg w-full bg-white shadow-xl border border-yellow-500 rounded-2xl p-10 mt-10"
      >
        <h1 className="text-3xl font-bold shadow-xl text-gray-800 mb-4 text-center">
          Contact Us
        </h1>
        <p className="text-gray-600 font-bold text-center mb-6 italic">
          Have questions or feedback? We'd love to hear from you!
        </p>

        {success && (
          <div className="mb-4 text-center text-green-600 font-semibold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows="4"
          ></textarea>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </motion.button>
        </form>

        {!isLoggedIn && (
          <p className="mt-4 text-center text-red-500 text-sm">
            🔒 You must be logged in to send messages.
          </p>
        )}
      </motion.div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 text-center py-6 mt-10">
        <p className="text-gray-600">
          &copy; {new Date().getFullYear()} Helper Hand Services. All rights reserved. |{" "}
          <Link to="/about" className="text-indigo-600 hover:underline">
            About Us
          </Link>{" "}
          | Email: support@helperhandservices.com | Phone: +91 7474747470
        </p>
      </footer>
    </div>
  );
}
