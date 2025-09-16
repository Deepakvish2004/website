const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    icon: { type: String, default: "🛠" }, // optional field
    isActive: { type: Boolean, default: true }, // to hide service without deleting
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
