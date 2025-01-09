const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Obține statistici generale
router.get('/', statsController.getStatistics);

module.exports = router;
