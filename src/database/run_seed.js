const fs = require('fs');
const path = require('path');

const db = require('./db'); 

// Creating a function to run the seed
function runSeed() {
    const seedFilePath = path.join(__dirname, 'seed.sql'); // Absolute path to the seed.sql file
    const seedContent = fs.readFileSync(seedFilePath, 'utf8'); // Reading the SQL seed file synchronously
    db.exec(seedContent); // Executing the SQL seed data to create the necessary tables in the database
}

module.exports = runSeed; // Exporting the runSeed function to use it on app.js