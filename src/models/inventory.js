const db = require('../database/db');

function getInventory(filters) {

    // Obtain which filters were provided by the user
    const conditions = [];
    const values = [];

    if (filters.storeId) {
        // If storeId filter is provided, add it to the conditions and values
        conditions.push('inventory.store_id = ?');
        values.push(filters.storeId);
    }

    if (filters.productId) {
        // If productId filter is provided, add it to the conditions and values
        conditions.push('inventory.product_id = ?');
        values.push(filters.productId);
    }

    // Dynamic SQL query construction based on provided filters
    let sqlText = `
        SELECT inventory.store_id, stores.name as store_name,
        inventory.product_id, products.name as product_name, 
        inventory.stock 

        FROM inventory

        JOIN stores 
        ON inventory.store_id = stores.id

        JOIN products
        ON inventory.product_id = products.id
        `;

    if (conditions.length > 0) {
        // If there are any conditions, append the WHERE clause to the SQL query
        sqlText += ` WHERE ${conditions.join(' AND ')}`;
    }

    const stmt = db.prepare(sqlText); // Prepare the SQL statement with the constructed query

    const inventory = stmt.all(...values); // Binding parameters
    return inventory;
}

function stockManagement(storeId, productId, flow, quantity, threshold) {
    // update the stock based on the flow (in or out) and quantity
    const currentStock = db.prepare(`
        SELECT inventory.stock, stores.name as store_name, products.name as product_name
        
        FROM inventory

        JOIN stores
        ON inventory.store_id = stores.id

        JOIN products
        ON inventory.product_id = products.id

        WHERE store_id = ? AND product_id = ?
        `);

    const stockResult = currentStock.get(storeId, productId); // Executing the query to get the current stock for the given store and product

    if (!stockResult) {
        // If no record exists for the given store and product, send a message indicating that the product is not found in the inventory
        return { error: "Product not found in the inventory for the given store." };
    }

    let updateStmt; // Declare newStock variable to hold the updated stock value
    let updateResult;

    // Update the stock based on the flow (in or out) and quantity
    if (flow === 'in') {
        // For 'in' flow, we simply increase the stock by the specified quantity, without any need to check for sufficiency since we are adding stock
        updateStmt = db.prepare('UPDATE inventory SET stock = stock + ? WHERE store_id = ? AND product_id = ?');

        updateResult = updateStmt.run(quantity, storeId, productId); // Execute the update statement to increase the stock by the specified quantity
    }

    if (flow === 'out') {
        // Different approach for 'out' flow: we need to check if the stock is sufficient before updating
        updateStmt = db.prepare('UPDATE inventory SET stock = stock - ? WHERE store_id = ? AND product_id = ? AND stock >= ?');
        updateResult = updateStmt.run(quantity, storeId, productId, quantity); // Execute the update statement to decrease the stock by the specified quantity

        // Check if the update affected any rows, if not, it means the stock was insufficient to perform the operation
        if (updateResult.changes === 0) {
            return { error: "Insufficient stock to remove the specified quantity. Current stock: " + stockResult.stock };
        }
    }

    // We need to get the stock again after the update to include it in the response
    const newStockResult = currentStock.get(storeId, productId);
    const newStock = newStockResult.stock; // Get the updated stock value after the update

    // response object
    const response = {
        message: `Stock updated. New stock: ${newStock}`,
        store_id: storeId,
        store_name: stockResult.store_name,
        product_id: productId,
        product_name: stockResult.product_name,
        newStock: newStock
    };

    if (newStock <= threshold) {
        response.warning = `Warning: The stock for this product is below the configured threshold of ${threshold}.`;
    }

    return response;
}

function sumStockAcrossStores(filters) {
    const conditions = []; // Array to hold the conditions for the SQL query
    const values = []; // Array to hold the values for the SQL query parameters. For dynamic filtering

    if (filters.productId) {
        conditions.push('inventory.product_id = ?');
        values.push(filters.productId);
    }

    let sqlText = `
        SELECT products.id as product_id, products.name as product_name, SUM(inventory.stock) as total_stock
        FROM inventory

        JOIN products
        ON inventory.product_id = products.id
    `;
    
    // If there are any conditions, append the WHERE clause to the SQL query
    if (conditions.length > 0) {
        sqlText += ` WHERE ${conditions.join(' AND ')}`;
    }

    sqlText += ` GROUP BY products.id, products.name`; // Grouping by product ID and name to get the total stock for each product

    const stmt = db.prepare(sqlText); // Prepare the SQL statement with the constructed query
    const result = stmt.all(...values); // Execute the query with the provided values and return the result
    return result
}

function getLowStockReport(threshold, filters) {

    const conditions = [];
    const values = [threshold]; // Start with the threshold value for the low stock condition

    if (filters.storeId) {
        conditions.push('inventory.store_id = ?');
        values.push(filters.storeId);
    }

    // Query to get low stock items based on the provided threshold
    // Thei idea is to join the inventory table with the stores and 
    // products tables to get the store name and product name along with the stock information
    // and filter the results to only include items where the stock is below the specified threshold
    let sqlText = `
        SELECT inventory.store_id, stores.name as store_name,
        inventory.product_id, products.name as product_name, 
        inventory.stock

        FROM inventory

        JOIN stores
        ON inventory.store_id = stores.id

        JOIN products
        ON inventory.product_id = products.id

        WHERE inventory.stock <= ?
    `;

    if (conditions.length > 0) {
        sqlText += ` AND ${conditions.join(' AND ')}`; // We use AND anyways for further filtering conditions.
    }
    
    const stmt = db.prepare(sqlText); // Prepare the SQL statement with the constructed query

    const lowStockItems = stmt.all(...values); // Execute the query with the provided threshold and return the result
    return lowStockItems;
}

module.exports = {
    getInventory,
    stockManagement,
    sumStockAcrossStores,
    getLowStockReport
};