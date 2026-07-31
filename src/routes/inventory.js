// Create router for inventory
// It helps to manage the endpoints related to inventory in a centralized manner
const express = require('express');
const router = express.Router();

const inventoryController = require('../controllers/inventory');

// Create a route to get all inventory
router.get('/', inventoryController.listInventory);

// Export the router to be used in other parts of the application
module.exports = router;