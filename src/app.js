require('dotenv').config(); // Loading environment variables from .env file. It goes at first because some of the other imported modules may depend on these environment variables

const express = require('express'); // Importing Express library
const runSchema = require('./database/run_schema');
const runSeed = require('./database/run_seed');

// Import the Routes
const storesRoutes = require('./routes/stores'); 
const inventoryRoutes = require('./routes/inventory');
const API = require('./middleware/apiAuth'); // Importing the API authentication middleware

// Calling functions to run the schema and seed the database before starting the server
runSchema();
runSeed();

const app = express(); // Creating an Express server instance. Initialize the database before accepting requests
app.use(express.json()); // Whenever data is sent in JSON format, it will be converted to a JavaScript object automatically,

// Defining a route - endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Adidas Stock Sync API' });
});

app.use('/stores', storesRoutes); // Using the stores routes for any requests that start with /stores
app.use('/inventory', inventoryRoutes); // Using the inventory routes for any requests that start with /inventory

const PORT = process.env.PORT || 3000;

// Server starting
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`); // Logging a message to the console indicating the server is running
});

