const Booking = require('../models/Booking');

// Submit feedback for a booking
exports.submitFeedback = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, review } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Feedback can only be submitted for completed bookings' });
    }

    booking.feedback = { rating, review, createdAt: new Date() };
    await booking.save();

    res.status(200).json({ message: 'Feedback submitted successfully', feedback: booking.feedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get feedback for a booking
exports.getFeedback = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).select('feedback');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ feedback: booking.feedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
