// backend/routes/workers.js
const express = require("express");
const { registerWorker, loginWorker, workerProtect } = require("../controllers/workerAuthController");
const {
  createWorker,
  getWorkers,
  updateWorker,
  deleteWorker,
  getMyBookings,
  updateBookingStatus,
} = require("../controllers/workerController");
const { protect, admin } = require("../controllers/authController");

const router = express.Router();

/**
 * ========== Worker Auth ==========
 */
// Only admin creates workers
router.post("/register", protect, admin, registerWorker);

// Worker login
router.post("/login", loginWorker);

/**
 * ========== Admin CRUD Workers ==========
 */
router.use(protect); // all routes below require admin or logged-in user

router.get("/", admin, getWorkers);
router.post("/", admin, createWorker);
router.patch("/:id", admin, updateWorker);
router.delete("/:id", admin, deleteWorker);

/**
 * ========== Worker Side ==========
 */
// Worker fetch own bookings (use workerProtect here!)
router.get("/my-bookings", workerProtect, getMyBookings);

// Worker update booking status
router.patch("/my-bookings/:id/status", workerProtect, updateBookingStatus);

module.exports = router;


