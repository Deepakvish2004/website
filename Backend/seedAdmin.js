// seedAdmin.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminExists = await User.findOne({ email: "adminperson@gmail.com" });
    if (adminExists) {
      console.log("Admin already exists:", adminExists.email);
      process.exit();
    }

    const admin = await User.create({
      name: "Super Admin",
      email: "adminperson@gmail.com",
      password: "admin", // plain password, will be hashed by pre-save
      role: "admin",
    });

    console.log("✅ Admin created:", admin.email);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
