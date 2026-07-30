const express = require('express'); // Importing Express library
require('dotenv').config(); // Loading environment variables from .env file

const app = express(); // Creating an Express server instance
app.use(express.json()); // Whenever data is sent in JSON format, it will be converted to a JavaScript object automatically,

// Defining a route - endpoint
// When the user visits the URL of the server, a GET request will be made
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Adidas Inventory Sync API!' }); // Sending a JSON response with a welcome message
});

const PORT = process.env.PORT || 3000; // Using the PORT from environment variables or defaulting to 3000
// Server starting
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`); // Logging a message to the console indicating the server is running
});