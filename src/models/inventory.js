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


module.exports = {
    getInventory,
};