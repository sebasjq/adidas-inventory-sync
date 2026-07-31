const db = require('../database/db');

// Related functions for consulting stores in the database

function getAllStores() {
    const stmt = db.prepare('SELECT * FROM stores'); // Prepares the SQL query
    const stores = stmt.all(); // Executes the query and returns all results
    return stores; // Returns the list of stores
}


// Exports the functions to be used in other parts of the application
module.exports = {
    getAllStores,
};