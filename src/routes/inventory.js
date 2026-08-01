// Create router for inventory
// It helps to manage the endpoints related to inventory in a centralized manner
const express = require('express');
const router = express.Router();

const inventoryController = require('../controllers/inventory');
const API = require('../middleware/apiAuth'); // Importing the API authentication middleware

// Create a route to get all inventory
router.get('/', inventoryController.listInventory);

// Create a route to update inventory by and authenticated store using API key
router.post('/stock-report', API.apiAuth, inventoryController.stockReport);

// Creating a route to consolidate inventory across all stores
router.get('/consolidate', inventoryController.consolidateInventory);

// Export the router to be used in other parts of the application
module.exports = router;