const inventoryModel = require('../models/inventory');

// Controller function to get all inventory with filters applied
function listInventory(req, res) {
    const filters = {
        storeId: req.query.store_id,
        productId: req.query.product_id,
    }

    const inventory = inventoryModel.getInventory(filters);
    res.json(inventory);
}

module.exports = {
    listInventory,
}; 