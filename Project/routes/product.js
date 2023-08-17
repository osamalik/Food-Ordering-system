const express = require('express');
const router = express.Router();
// Load User Controller
const productController = require('../controllers/product.controller')
const orderController = require('../controllers/order.controller')
const { forwardAuthenticated } = require('../config/auth');

router.post('/create', productController.create);

router.post("/update/:id", productController.update);


router.get('/delete/:id', productController.delete);

router.post('/order', orderController.order);

module.exports = router;
