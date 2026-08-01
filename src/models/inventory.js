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

function stockManagement(storeId, productId, flow, quantity) {
    // update the stock based on the flow (in or out) and quantity
    const currentStock = db.prepare('SELECT stock FROM inventory WHERE store_id = ? AND product_id = ?');

    const stockResult = currentStock.get(storeId, productId);

    if (!stockResult) {
        // If no record exists for the given store and product, send a message indicating that the product is not found in the inventory
        return { error: "Product not found in the inventory for the given store." };
    }

    let newStock; // Declare newStock variable to hold the updated stock value


    if (flow === 'in') {
        newStock = stockResult.stock + quantity; // Access to the property stock of the object returned by the query
    }

    if (flow === 'out') {
        if (stockResult.stock < quantity) {
            // If the current stock is less than the quantity to be removed, send an error message indicating insufficient stock
            return { error: "Insufficient stock to remove the specified quantity. Current stock: " + stockResult.stock };
        }
        else{
            newStock = stockResult.stock - quantity; // Access to the property stock of the object returned by the query
        }
    }

    const updateStmt = db.prepare('UPDATE inventory SET stock = ? WHERE store_id = ? AND product_id = ?');
    updateStmt.run(newStock, storeId, productId);
    return { message: `Stock updated. New stock: ${newStock}` };
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

        WHERE inventory.stock < ?
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