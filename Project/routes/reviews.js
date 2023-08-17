const express = require('express');
const router = express.Router();
// Load User Controller
const reviewController = require('../controllers/review.controller')
const { forwardAuthenticated } = require('../config/auth');

router.post('/create', reviewController.create);


module.exports = router;
