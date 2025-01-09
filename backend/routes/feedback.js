const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Obține toate feedback-urile
router.get('/', feedbackController.getAllFeedback);

// Adaugă un feedback nou
router.post('/', feedbackController.addFeedback);

module.exports = router;
