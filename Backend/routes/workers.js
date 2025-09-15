const express = require("express");
const {
  registerWorker,
  loginWorker,
  workerProtect,
} = require("../controllers/workerAuthController");
const {
  createWorker,
  getWorkers,
  updateWorker,
  deleteWorker,
  getMyBookings,
  updateBookingStatus,
  toggleWorkerActive,
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
 * ========== Worker Side ==========
 */
// ✅ Worker routes should NOT be blocked by `protect`
router.get("/my-bookings", workerProtect, getMyBookings);
router.patch("/my-bookings/:id/status", workerProtect, updateBookingStatus);
router.patch("/toggle-active", workerProtect, toggleWorkerActive);

/**
 * ========== Admin CRUD Workers ==========
 */
router.get("/", protect, admin, getWorkers);
router.post("/", protect, admin, createWorker);
router.patch("/:id", protect, admin, updateWorker);
router.delete("/:id", protect, admin, deleteWorker);

module.exports = router;
