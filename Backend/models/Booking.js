const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  details: { type: String },
  bookingDate: { type: Date, required: true },
  status: {
    type: String,
    enum: [
      'pending',      // booking created
      'accepted',     // worker accepted
      'in_progress',
      'confirmed',  // work started
               // worker marked as done
      'completed',    // user approved
      'cancelled',    // cancelled by user/admin
      'rejected' ,
      "assigned" ,
      "done",    // worker marked as done
    ],
    default: 'pending'
  },

  userApproval: { type: Boolean, default: false },
  workerNote: { type: String },
  doneAt: { type: Date },
  completedAt: { type: Date },

  // Extra user details
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
   feedback: {
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  // Worker assignment
  assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', default: null },
  assignmentNote: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now }
});

// ✅ Prevent saving bookings with past dates
bookingSchema.pre('save', function(next) {
  if (this.bookingDate.getTime() < Date.now()) {
    return next(new Error('Booking date cannot be in the past'));
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
