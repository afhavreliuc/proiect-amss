const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservationsController');

router.get('/', reservationsController.getAllReservations);
router.post('/', reservationsController.createReservation);

module.exports = router;
