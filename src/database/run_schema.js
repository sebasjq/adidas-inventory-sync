const fs = require('fs');
const path = require('path');
const db = require('./db'); // Importing the database instance from db.js

// Creating a function to run the schema
function runSchema() {
    const filePath = path.join(__dirname, 'schema.sql'); // Absolute path to the schema.sql file
    const schema = fs.readFileSync(filePath, 'utf8'); // Reading the SQL schema file synchronously
    db.exec(schema); // Executing the SQL schema to create the necessary tables in the database
}

module.exports = runSchema; // Exporting the runSchema function to use it on app.js