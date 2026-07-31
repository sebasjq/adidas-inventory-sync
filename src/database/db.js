const Database = require('better-sqlite3'); // Importing the better-sqlite3 library for SQLite database management
const db = new Database('stock-management.db'); // Creating a new SQLite database instance named 'inventory.db'

module.exports = db; // Exporting the database instance for use in other parts of the application