const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');

router.get('/', roomsController.getAllRooms);
router.post('/', roomsController.createRoom);

module.exports = router;
