const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const User = require("../models/User"); // ✅ Make sure User model is imported
const Worker = require("../models/Worker");
const nodemailer = require("nodemailer");
const e = require("express");

// ================== MAIL TRANSPORTER ==================
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================== CREATE BOOKING ==================
exports.createBooking = asyncHandler(async (req, res) => {
  const { service, details, bookingDate, name, phone, address } = req.body;

  if (!service || !bookingDate || !name || !phone || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (new Date(bookingDate) < new Date()) {
    return res.status(400).json({ message: "Booking date must be in the future" });
  }

  const SERVICE_PRICES = {
    cleaners: 200,
    helper: 150,
    washing: 100,
  };

  const price = SERVICE_PRICES[service] || 0;

  const booking = await Booking.create({
    user: req.user._id,
    service,
    price,
    details,
    bookingDate,
    name,
    phone,
    address,
    
  });

  // Send confirmation email
  try {
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: req.user.email,
      subject: "Booking Received - HelperHand Services",
      text: `Hi ${req.user.name},\n\nYour booking for ${service} on ${new Date(
        bookingDate
      ).toLocaleString()} has been received.\nBooking ID: ${booking._id}\nPrice: ₹${price}\n\nThanks!`,
    });
  } catch (err) {
    console.error("Email send error:", err.message);
  }

  res.status(201).json(booking);
});

// ================== GET USER BOOKINGS ==================
exports.getUserBookings = asyncHandler(async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("assignedWorker", "name email phone services age gender")
      .populate("user", "name email phone address age gender") // ✅ Populate user properly
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== CANCEL BOOKING ==================
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.status === "cancelled")
    return res.status(400).json({ message: "Booking already cancelled" });

  booking.status = "cancelled";
  await booking.save();

  try {
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: req.user.email,
      subject: "Booking Cancelled - HelperHand Services",
      text: `Hi ${req.user.name},\n\nYour booking for ${booking.service} on ${new Date(
        booking.bookingDate
      ).toLocaleString()} has been cancelled.\nBooking ID: ${booking._id}`,
    });
  } catch (err) {
    console.error("Email send error:", err.message);
  }

  res.json({ message: "Booking cancelled successfully", booking });
});

// ================== ADMIN GET ALL BOOKINGS ==================
exports.getAllBookings = asyncHandler(async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone address")
      .populate("assignedWorker", "name email phone services age gender")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== UPDATE BOOKING STATUS ==================
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await Booking.findById(id).populate("user", "name email");
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  booking.status = status;
  await booking.save();

  try {
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: booking.user.email,
      subject: "Booking Status Updated - HelperHand Services",
      text: `Hi ${booking.user.name || "Customer"}, your booking for ${booking.service} on ${new Date(
        booking.bookingDate
      ).toLocaleString()} is now marked as ${status}. Booking ID: ${booking._id}`,
    });
  } catch (err) {
    console.error("Email send error:", err.message);
  }

  res.json(booking);
});

// ================== DELETE BOOKING ==================
exports.deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (String(booking.user) !== String(req.user._id) && req.user.role !== "admin")
    return res.status(403).json({ message: "Not allowed" });

  await Booking.findByIdAndDelete(id);
  res.json({ message: "Booking removed" });
});


// ================== ASSIGN WORKER ==================
exports.assignWorker = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { workerId, note } = req.body;

  const booking = await Booking.findById(id).populate("user", "name email address phone");
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const worker = await Worker.findById(workerId);
  if (!worker) return res.status(400).json({ message: "Worker not found" });

  // Ensure worker provides the required service
  const workerServices = worker.services.map(s => (typeof s === "string" ? s : s.name));
  if (!workerServices.includes(booking.service)) {
    return res.status(400).json({
      message: `Worker "${worker.name}" does not provide "${booking.service}"`
    });
  }

  // Assign worker to booking
  booking.assignedWorker = worker._id;
  booking.assignmentNote = note?.trim() || "";
  booking.status = "confirmed"; // confirmed means assigned
  await booking.save();

  // Update worker status
  worker.active = true;
  await worker.save();

  // Send emails
  try {
    // Email → User
    if (booking.user.email) {
      await transporter.sendMail({
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: booking.user.email,
        subject: "Booking Assigned - HelperHand",
        text: `Hi ${booking.user.name}, your booking (${booking._id}) for ${booking.service} has been assigned to worker ${worker.name}.`,
      });
    }

    // Email → Worker
    if (worker.email) {
      await transporter.sendMail({
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: worker.email,
        subject: "New Job Assigned - HelperHand",
        text: `Hi ${worker.name}, you have a new booking assigned.\nBooking ID: ${booking._id}\nService: ${booking.service}\nCustomer: ${booking.user.name}`,
      });
    }
  } catch (err) {
    console.error("Email send error (assignment):", err.message);
  }

  // Repopulate booking with user & worker details
  await booking.populate([
    { path: "assignedWorker", select: "name phone services age gender status" },
    { path: "user", select: "name address phone" },
  ]);

  res.json({ message: "Worker assigned successfully", booking });
});

// ================== UNASSIGN WORKER ==================
exports.unassignWorker = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id).populate("assignedWorker", "name");
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const workerId = booking.assignedWorker?._id;

  booking.assignedWorker = null;
  booking.assignmentNote = "";
  booking.status = "pending"; // booking is now unassigned
  await booking.save();

  // Reset worker status only if they have no other active bookings
  if (workerId) {
    const otherBookings = await Booking.find({
      assignedWorker: workerId,
      status: { $in: ["confirmed", "done"] }
    });

    if (!otherBookings.length) {
      const worker = await Worker.findById(workerId);
      if (worker) {
        worker.active = false;
        await worker.save();
      }
    }
  }

  res.json({ message: "Worker unassigned successfully", booking });
});

// ================== MARK BOOKING AS DONE (directly completed by worker) ==================
exports.markDone = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  // Ensure only assigned worker (or admin) can mark as done
  if (!req.user || (booking.assignedWorker?.toString() !== req.user._id.toString() && !req.user.isAdmin)) {
    return res.status(403).json({ message: "Not allowed to mark this booking as done" });
  }

  // Validate status
  if (["cancelled", "completed"].includes(booking.status)) {
    return res.status(400).json({ message: "Booking cannot be marked done in its current state" });
  }

  // ✅ Directly mark as completed
  booking.status = "completed"; 
  booking.doneAt = Date.now();
  booking.userApproval = true; // Optional: if you want auto-approval by worker

  await booking.save();

  res.json({ message: "Booking marked as completed ✅", booking });
});


// ================== USER APPROVES WORK ==================
exports.approveWork = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Ensure only the booking owner can approve
  if (!req.user || booking.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to approve this booking" });
  }

  // Can only approve if worker has already marked as done
  if (booking.status !== "done") {
    return res
      .status(400)
      .json({ message: "Worker has not marked the booking as done yet" });
  }

  booking.userApproval = true;
  booking.status = "completed";    // final completed status
  booking.completedAt = Date.now();

  await booking.save();

  res.json({ message: "✅ Work approved successfully", booking });
});


