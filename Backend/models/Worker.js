// Backend/models/Worker.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true, minlength: 6 },
    services: [{ type: String, required: true }], // e.g. ["cleaner","plumber"]
    address: [{ type: String, required: true }], // e.g. ["123 Main St", "City", "Country"]
    age: [{ type: Number, min: 18 }], // optional min age validation
    pincode: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    image: { type: String },
    active: { type: Boolean, default: true }, // ✅ worker is active by default
  availability: {
    days: [{ type: String }], // e.g. ["Monday", "Wednesday", "Friday"]
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

    

    role: {
    type: String,
    default: "worker"
  },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);


// Hash password before save
workerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
workerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("Worker", workerSchema);
