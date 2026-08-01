const storesModel = require('../models/stores');

// Controller function to get all stores
function listAllStores(req, res) {
    const stores = storesModel.getAllStores(); // Call the model function to get all stores
    res.json(stores); // Send the list of stores as a JSON response
}

// Export the controller functions to be used in the routes
module.exports = {
    listAllStores,
};