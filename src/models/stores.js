const db = require('../database/db');

// Related functions for consulting stores in the database

function getAllStores() {
    const stmt = db.prepare('SELECT id, name FROM stores'); // Prepares the SQL query
    const stores = stmt.all(); // Executes the query and returns all results
    return stores; // Returns the list of stores
}

function getStoreByApiKey(apiKey){
    const stmt = db.prepare('SELECT * FROM stores WHERE api_key = ?'); // Prepares the SQL query with a placeholder for the API key
    const store = stmt.get(apiKey); // Executes the query with the API key and returns the result
    return store; // Returns the complete store info
}

// Exports the functions to be used in other parts of the application
module.exports = {
    getAllStores,
    getStoreByApiKey,
};