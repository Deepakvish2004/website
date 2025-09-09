// Backend/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: String, required: true },
  price: { type: Number, required: true,default: 0 },
  details: { type: String },
  bookingDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed',"accepted" ,'cancelled', "marked" ,"assigned","completed","done"], 
    default: 'pending' 
  },

  userApproval: {
  type: Boolean,
  default: false
},
doneAt: { type: Date },
completedAt: { type: Date },

  // Extra user details
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },

  // Worker assignment
  assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', default: null },
  assignmentNote: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now }
});

// ✅ Prevent saving bookings with past dates
bookingSchema.pre('save', function(next) {
  if (this.bookingDate < Date.now()) {
    return next(new Error('Booking date cannot be in the past'));
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
