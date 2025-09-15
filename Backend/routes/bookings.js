// Backend/routes/bookings.js
const express = require("express");
const { protect, admin } = require("../controllers/authController");
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  assignWorker,
  unassignWorker,
  cancelBooking,
  markDone,
  approveWork,
  markSuccessful,
} = require("../controllers/bookingController");

const router = express.Router();

// ✅ All routes below require authentication
router.use(protect);

router.patch("/:id/success", protect, markSuccessful);

// Worker marks assigned booking as done
router.put("/:id/mark-done", markDone);

// User approves completed work
router.put("/:id/approve", approveWork);

// Create a new booking
router.post("/", createBooking);

// Get logged-in user’s bookings
router.get("/my", getUserBookings);

// Admin: get all bookings
router.get("/", admin, getAllBookings);

// Admin: update booking status
router.patch("/:id/status", admin, updateBookingStatus);

// Cancel a booking (user or admin depending on logic)
router.put("/:id/cancel", cancelBooking);

// Admin: assign/unassign worker
router.patch("/:id/assign", admin, assignWorker);
router.patch("/:id/unassign", admin, unassignWorker);

// Delete a booking
router.delete("/:id", deleteBooking);

module.exports = router;
