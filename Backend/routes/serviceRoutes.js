
const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// GET all services (for users)
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create service (Admin only)
router.post("/", async (req, res) => {
  try {
    const newService = await Service.create(req.body);
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update service (Admin only)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE service (Admin only)
router.delete("/:id", async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
