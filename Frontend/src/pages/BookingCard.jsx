import React, { useState, useEffect } from "react";
import API from "../api/axios";
import FeedbackForm from "./FeedbackForm";

export default function BookingCard({ booking }) {
  const [feedback, setFeedback] = useState(booking.feedback || null);

  const handleFeedbackSubmitted = (newFeedback) => {
    setFeedback(newFeedback);
  };

  return (
    <div className="booking-card">
      <h4>Service: {booking.service}</h4>
      <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
      <p>Status: {booking.status}</p>

      {booking.status === "completed" && !feedback && (
        <FeedbackForm bookingId={booking._id} onFeedbackSubmitted={handleFeedbackSubmitted} />
      )}

      {feedback && (
        <div className="feedback-display">
          <h5>Your Feedback:</h5>
          <p>Rating: {feedback.rating} / 5</p>
          <p>Review: {feedback.review}</p>
        </div>
      )}
    </div>
  );
}
