const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Submit feedback
router.post('/:bookingId', feedbackController.submitFeedback);

// Get feedback
router.get('/:bookingId', feedbackController.getFeedback);

module.exports = router;
