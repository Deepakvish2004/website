const asyncHandler = require("express-async-handler");
const Worker = require("../models/Worker");
const jwt = require("jsonwebtoken");



// Generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register worker (admin only should call this in real flow)
exports.registerWorker = asyncHandler(async (req, res) => {
  const { name, email, phone, password, services, address, pincode, age, gender, image } = req.body;

  if (!name || !email || !password || !services?.length || !address?.length || !pincode || !age || !gender || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const workerExists = await Worker.findOne({ email });
  if (workerExists) {
    return res.status(400).json({ message: "Worker already exists" });
  }

  const worker = await Worker.create({ name, email, phone, password, services, address , pincode , age , gender , image });

  res.status(201).json({
    _id: worker._id,
    name: worker.name,
    email: worker.email,
    services: worker.services,
    address: worker.address,
    pincode: worker.pincode,
    age: worker.age,
    gender: worker.gender,
    image : worker.image,
    token: generateToken(worker._id, "worker"),
  });
});

// Worker login
exports.loginWorker = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const worker = await Worker.findOne({ email });
  if (worker && (await worker.matchPassword(password))) {
    res.json({
      _id: worker._id,
      name: worker.name,
      email: worker.email,
      services: worker.services,
      address: worker.address,
      pincode: worker.pincode,
      age: worker.age,
      gender: worker.gender,
      image : worker.image,
      token: generateToken(worker._id, "worker"),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});


exports.workerProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const worker = await Worker.findById(decoded.id).select("-password");
    if (!worker) return res.status(401).json({ message: "Worker not found" });

    req.user = worker;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token failed" });
  }
});
