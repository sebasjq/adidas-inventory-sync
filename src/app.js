const express = require('express'); // Importing Express 
const app = express(); // Creating an Express app

// Defining a route
app.get('/', (request, response) => {
    response.send('Hello, World!'); // Response
});

// Server starting
app.listen(3000);