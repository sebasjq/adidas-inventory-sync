// Create routes for stores
// It helps to manage the endpoints related to stores in a centralized manner
const express = require('express');
const router = express.Router();

const storesController = require('../controllers/stores');

// Create a route to get all stores
router.get('/', storesController.listAllStores);

// Export the router to be used in other parts of the application
module.exports = router;