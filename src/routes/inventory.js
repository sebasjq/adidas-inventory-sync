// Create router for inventory
// It helps to manage the endpoints related to inventory in a centralized manner
const express = require('express');
const router = express.Router();

const inventoryController = require('../controllers/inventory');
const API = require('../middleware/apiAuth'); // Importing the API authentication middleware

// Create a route to get all inventory
router.get('/', inventoryController.listInventory);

router.post('/stock-report', API.apiAuth, inventoryController.stockReport);

// Export the router to be used in other parts of the application
module.exports = router;