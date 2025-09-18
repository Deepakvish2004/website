import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const prices = 500; // Example fallback price

const fallbackServices = {
  Cleaners: { name: "Cleaners", price: prices },
  Washing: { name: "Washing", price: prices },
  Electrical: { name: "Electrical", price: prices },
  Carpentry: { name: "Carpentry", price: prices },
  Plumber: { name: "Plumber", price: prices },
  Electrician: { name: "Electrician", price: prices },
  Delivery: { name: "Delivery", price: prices },
  Repairing: { name: "Repairing", price: prices },
  Laundry: { name: "Laundry", price: prices },
  Cooking: { name: "Cooking", price: prices },
  Housekeeping: { name: "Housekeeping", price: prices },
  Labour: { name: "Labour", price: prices },
};

export default function BookingPage() {
  const { service } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedService =
    location.state || fallbackServices[service] || { name: "", price: 0 };

  const [bookingDate, setBookingDate] = useState("");
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paid, setPaid] = useState(false);
  const [showPaymentCard, setShowPaymentCard] = useState(false);

  // ✅ Track validation errors
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (phone.length !== 10) newErrors.phone = "Phone must be exactly 10 digits";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!bookingDate.trim()) newErrors.bookingDate = "Select a date & time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = () => {
    if (!validateFields()) {
      toast.error("⚠️ Please fill all required fields correctly!");
      return;
    }
    setShowPaymentCard(true);
  };

  const confirmPayment = () => {
    setShowPaymentCard(false);
    setPaid(true);
    toast.success("✅ Payment Successful! You can now confirm your booking.", {
      position: "top-center",
      style: {
        background: "#d1fae5",
        color: "#065f46",
        fontWeight: "bold",
        textAlign: "center",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paid) {
      toast.error("⚠️ Please complete payment before booking!");
      return;
    }

    try {
      await API.post("/bookings", {
        service: selectedService.name,
        price: selectedService.price,
        details,
        bookingDate,
        name,
        phone,
        address,
      });

      toast.success(`✅ Booking created for ${selectedService.name}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating booking");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "radial-gradient(circle at top right, #3b82f6, #6366f1, #8b5cf6)",
      }}
    >
      {/* ✅ Premium Animated Payment Modal */}
      <AnimatePresence>
        {showPaymentCard && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPaymentCard(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-1xl max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPaymentCard(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
              >
                ✖
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 250, delay: 0.1 }}
                className="flex justify-center  mb-4"
              >
                <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                  ✅
                </div>
              </motion.div>

              <h3 className="text-2xl font-bold text-green-700">Payment Successful!</h3>
              <p className="text-gray-700 mt-2">
                Service: <b>{selectedService.name}</b>
              </p>
              <p className="text-gray-700">
                Amount Paid: <b>₹{selectedService.price}</b>
              </p>
              <p className="text-gray-700">
                Date: <b>{new Date(bookingDate).toLocaleString()}</b>
              </p>

              <motion.button
                onClick={confirmPayment}
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OK
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Booking Form */}
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Book: {selectedService.name}
        </h2>

        <p className="text-lg text-green-700 font-semibold mb-4 text-center">
          Price: ₹{selectedService.price}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <label className="block">
            <span className="text-gray-700">Your Name</span>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 p-2 border w-full rounded ${
                errors.name ? "border-red-500" : ""
              }`}
              disabled={paid}
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
          </label>

          {/* Phone */}
          <label className="block">
            <span className="text-gray-700">Phone</span>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className={`mt-1 p-2 border w-full rounded ${
                errors.phone ? "border-red-500" : ""
              }`}
              maxLength="10"
              disabled={paid}
            />
            {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
          </label>

          {/* Address */}
          <label className="block">
            <span className="text-gray-700">Address</span>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`mt-1 p-2 border w-full rounded ${
                errors.address ? "border-red-500" : ""
              }`}
              placeholder="Enter your address"
              disabled={paid}
            />
            {errors.address && (
              <span className="text-red-500 text-sm">{errors.address}</span>
            )}
          </label>

          {/* Date */}
          <label className="block">
            <span className="text-gray-700">Date & Time</span>
            <input
              required
              type="datetime-local"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className={`mt-1 p-2 border w-full rounded ${
                errors.bookingDate ? "border-red-500" : ""
              }`}
              disabled={paid}
            />
            {errors.bookingDate && (
              <span className="text-red-500 text-sm">{errors.bookingDate}</span>
            )}
          </label>

          {/* Details */}
          <label className="block">
            <span className="text-gray-700">Details</span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mt-1 p-2 border w-full rounded"
              placeholder="Any special instructions?"
              disabled={paid}
            />
          </label>

          {!paid ? (
            <motion.button
              type="button"
              onClick={handlePayment}
              className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg shadow-lg font-semibold"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              💳 Pay Now
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              ✅ Confirm Booking
            </motion.button>
          )}
        </form>
      </div>
    </div>
  );
}
