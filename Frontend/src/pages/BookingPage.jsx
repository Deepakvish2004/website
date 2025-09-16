import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";

const fallbackServices = {
  cleaners: { name: "Cleaners", price: 200 },
  helper: { name: "Helper", price: 150 },
  washing: { name: "Washing", price: 100 },
};

export default function BookingPage() {
  const { service } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedService =
    location.state || fallbackServices[service] || { name: "", price: 0 };

  const [bookingDate, setBookingDate] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState(selectedService.price);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paid, setPaid] = useState(false);

  const handlePayment = () => {
    if (!name || !phone || !address || !bookingDate) {
      alert("⚠️ Please fill all required fields before proceeding to payment.");
      return;
    }

    if (phone.length !== 10) {
      alert("⚠️ Phone number must be exactly 10 digits");
      return;
    }

    if (window.confirm(`💳 Pay ₹${selectedService.price} for ${selectedService.name}?`)) {
      setPaid(true);
      alert("✅ Payment successful (demo)");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paid) {
      alert("⚠️ Please complete payment before booking!");
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

      alert(`✅ Booking created for ${selectedService.name}. Check your email.`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating booking");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "radial-gradient(circle at top right, #3b82f6, #6366f1, #8b5cf6)",
      }}
    >
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
              className="mt-1 p-2 border w-full rounded"
              disabled={paid}
            />
          </label>

          {/* Phone */}
          <label className="block">
            <span className="text-gray-700">Phone</span>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="mt-1 p-2 border w-full rounded"
              pattern="^\d{10}$"
              maxLength="10"
              title="Enter exactly 10 digits"
              disabled={paid}
            />
          </label>

          {/* Price (readonly) */}
          <label className="block">
            <span className="text-gray-700">Price</span>
            <input
              type="text"
              value={selectedService.price}
              readOnly
              className="mt-1 p-2 border w-full rounded bg-gray-100"
            />
          </label>

          {/* Address */}
          <label className="block">
            <span className="text-gray-700">Address</span>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 p-2 border w-full rounded"
              placeholder="Enter your address"
              disabled={paid}
            />
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
              className="mt-1 p-2 border w-full rounded"
              disabled={paid}
            />
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
            <button
              type="button"
              onClick={handlePayment}
              className="w-full py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition"
            >
              💳 Pay Now
            </button>
          ) : (
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              ✅ Confirm Booking
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
