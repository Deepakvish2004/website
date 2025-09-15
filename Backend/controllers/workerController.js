const asyncHandler = require("express-async-handler");
const Worker = require("../models/Worker");
const Booking = require("../models/Booking");

/**
 * ======================
 * Admin CRUD on Workers
 * ======================
 */
exports.createWorker = asyncHandler(async (req, res) => {
  const { name, email, phone, services , image } = req.body;

  if (!name || !services || !services.length) {
    return res
      .status(400)
      .json({ message: "Name and at least one service required" });
  }

  // Prevent duplicate email
  const existing = await Worker.findOne({ email });
  if (existing) {
    return res
      .status(400)
      .json({ message: "Worker with this email already exists" });
  }

  const worker = await Worker.create({ name, email, phone, services,pincode,age,gender,address });
  res.status(201).json(worker);
});

exports.getWorkers = asyncHandler(async (req, res) => {
  const { service, active } = req.query;
  const q = {};
  if (service) q.services = service;
  if (active !== undefined) q.active = active === "true";

  const workers = await Worker.find(q).sort({ name: 1 });
  res.json(workers);
});

exports.updateWorker = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const worker = await Worker.findByIdAndUpdate(id, req.body, { new: true });
  if (!worker) return res.status(404).json({ message: "Worker not found" });
  res.json(worker);
});

/**
 * Prevent deletion if worker has active bookings
 */
exports.deleteWorker = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check for assigned bookings
  const assignedBookings = await Booking.countDocuments({
    assignedWorker: id,
  });
  if (assignedBookings > 0) {
    return res.status(400).json({
      message: "Cannot delete worker: worker is assigned to active bookings",
    });
  }

  const worker = await Worker.findByIdAndDelete(id);
  if (!worker) return res.status(404).json({ message: "Worker not found" });

  res.json({ message: "Worker removed successfully" });
});

/**
 * ======================
 * Worker Side
 * ======================
 */

// Get all bookings assigned to logged-in worker
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ assignedWorker: req.user._id })
    .populate("user", "name address phone") // ✅ only useful fields
    .populate("assignedWorker", "name phone services address pincode age gender image")
    .sort({ bookingDate: -1 });

  res.json(bookings);
});

// Worker updates booking status
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["accepted", "in-progress", "completed", "cancelled"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const booking = await Booking.findOne({
    _id: id,
    assignedWorker: req.user._id,
  });

  if (!booking) {
    return res
      .status(404)
      .json({ message: "Booking not found or not assigned to you" });
  }

  booking.status = status;
  await booking.save();

  res.json({ message: "Status updated", booking });
});

// Admin assigns a worker to a booking
exports.assignWorker = asyncHandler(async (req, res) => {
  const { bookingId, workerId } = req.body;

  const booking = await Booking.findById(bookingId).populate(
    "user",
    "name address phone address pincode age gender image"
  );
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  booking.assignedWorker = workerId;
  booking.status = "confirmed"; // auto confirm once assigned
  await booking.save();

  const populatedBooking = await booking.populate(
    "assignedWorker",
    "name phone services address pincode age gender image"
  );

  res.json({
    message: "Worker assigned successfully",
    booking: populatedBooking,
  });
});

// ✅ Toggle Active Status
exports.toggleWorkerActive = asyncHandler(async (req, res) => {
  const worker = await Worker.findById(req.user._id);
  if (!worker) {
    return res.status(404).json({ message: "Worker not found" });
  }

  worker.active = !worker.active; // flip the status
  await worker.save();

  res.json({
    message: `Worker is now ${worker.active ? "active" : "inactive"}`,
    active: worker.active,
  });
});