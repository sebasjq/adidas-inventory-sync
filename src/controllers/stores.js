const storesModel = require('../models/stores');

// Controller function to get all stores
function listAllStores(req, res) {
    const stores = storesModel.getAllStores();
    res.json(stores);
}

// Export the controller functions to be used in the routes
module.exports = {
    listAllStores,
};