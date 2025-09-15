import React, { useState } from "react";
import API from "../api/axios";

export default function FeedbackForm({ bookingId, onFeedbackSubmitted }) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post(`/feedback/${bookingId}`, { rating, review });
      onFeedbackSubmitted(res.data.feedback);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <h3>Submit Feedback</h3>
      <div>
        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Review:</label>
        <textarea value={review} onChange={(e) => setReview(e.target.value)} />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
    </form>
  );
}
