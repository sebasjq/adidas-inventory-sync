// This middelware function checks for the presence of an API 
// key in the request headers and validates it. 
// If the API key is missing or invalid, it responds with a 401 Unauthorized status. 
// Otherwise, it allows the request to proceed to the controller.

const storesModel = require('../models/stores');

function apiAuth(req, res, next) {
    const apiKey = req.header("x-api-key"); // Obtain the API key from the request headers

    if (!apiKey) {
        // If the API key is missing, respond with a 401 Unauthorized status
        return res.status(401).json({ error: "API key is missing" });
    }

    // If it exists, but it is not on the database, respond with a 401 Unauthorized status
    const store = storesModel.getStoreByApiKey(apiKey); // Validate the API key against the database

    if (!store) {
        return res.status(401).json({ error: "Invalid API key" });
    }

    // We can move to the controller
    // Let the controller know...
    req.store = store; // Attach the store information to the request object for use in the controller
    next(); // Call the next middleware or controller function
}


module.exports = {
    apiAuth,
}
