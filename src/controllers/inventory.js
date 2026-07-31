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


function stockReport(req, res) {
    // Info from middleware
    const storeId = req.store.id; // Get the store ID from the authenticated request

    // Info from the client
    const { product_id, flow, quantity } = req.body; // Get the product ID, flow, and quantity from the request body

    // Error manager
    if (flow !== 'in' && flow !== 'out') {
        return res.status(400).json({ error: "Invalid flow value. Must be 'in' or 'out'." });
    }

    if (quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be a positive number." });
    }

    // Llamar el modelo
    const result = inventoryModel.stockManagement(storeId, product_id, flow, quantity);

    if (result.error) {
        return res.status(400).json({ error: result.error });// Bad request
    }

    return res.status(200).json(result); // OK

}

module.exports = {
    listInventory,
    stockReport,
}; 