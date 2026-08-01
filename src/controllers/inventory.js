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

    const threshold = parseInt(process.env.LOW_STOCK_THRESHOLD); // Get the low stock threshold from environment variables

    // Info from the client
    const { product_id, flow, quantity } = req.body; // Get the product ID, flow, and quantity from the request body

    // Error manager
    if (!product_id || !flow || !quantity) {
        return res.status(400).json({ error: "Missing required fields: product_id, flow, and quantity are required." });
    }
    
    if (flow !== 'in' && flow !== 'out') {
        return res.status(400).json({ error: "Invalid flow value. Must be 'in' or 'out'." });
    }
    
    // Assure the quantity and the product_id are a positive integer numbers

    if (!Number.isInteger(product_id) || product_id <= 0) {
        return res.status(400).json({ error: "Product ID must be a positive integer." });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be a positive integer." });
    }

    // Llamar el modelo
    const result = inventoryModel.stockManagement(storeId, product_id, flow, quantity, threshold);

    if (result.error) {
        return res.status(400).json({ error: result.error });// Bad request
    }

    return res.status(200).json(result); // OK

}

// Controller function to consolidate inventory across all stores
// It's gonna be passed 
function consolidateInventory(req, res) {
    const filters = {
        productId: req.query.product_id,
    }
    
    const consolidatedInventory = inventoryModel.sumStockAcrossStores(filters);
    res.json(consolidatedInventory);
}

function lowStockReport(req, res) {

    const filters = {
        storeId: req.query.store_id,
    }

    const threshold = parseInt(process.env.LOW_STOCK_THRESHOLD); // Get the low stock threshold from environment variables
    
    const lowStockItems = inventoryModel.getLowStockReport(threshold, filters);
    res.json(lowStockItems);
}

module.exports = {
    listInventory,
    stockReport,
    consolidateInventory,
    lowStockReport
}; 