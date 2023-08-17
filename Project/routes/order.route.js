const express = require('express');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const router = express.Router();
const orderController = require('../controllers/order.controller')

router.post('/orders', ensureAuthenticated, orderController.order);

router.get('/display_order/:page', ensureAuthenticated, orderController.orders)

router.get('/updateOrder', ensureAuthenticated, orderController.update)

router.get('/delete/:id', ensureAuthenticated, orderController.delete);

router.post('/update/:id', ensureAuthenticated, orderController.updateOrder)

module.exports = router;
