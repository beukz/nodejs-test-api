/**
 * app.js
 * 
 * A simple NodeJS API using Express that listens for a POST request,
 * accepts a JSON payload with a "name" field, and returns a welcome message.
 * 
 * Author: ChatGPT (for Dan💻)
 * Date: 2025-02-01
 */

"use strict";

// Import required modules
const express = require('express');
const morgan = require('morgan');

// Create an Express application instance
const app = express();

// Middlewares
app.use(express.json()); // Parse JSON bodies in requests
app.use(morgan('combined')); // Log HTTP requests for monitoring and debugging

/**
 * POST /welcome
 * 
 * This endpoint expects a JSON payload with a "name" field.
 * If provided, it responds with a welcome message.
 */
app.post('/welcome', (req, res) => {
    try {
        // Extract the name from the request body
        const { name } = req.body;
        
        // Validate that the name field is provided
        if (!name) {
            // ❗ Respond with an error if the name is missing
            return res.status(400).json({ error: 'Name field is required' });
        }

        // Construct the welcome message
        const welcomeMessage = `Welcome ${name}`;

        // Respond with the welcome message in JSON format
        return res.status(200).json({ message: welcomeMessage });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error handling /welcome POST request:', error);
        
        // ❗ Respond with a generic internal server error
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * Global error handling middleware.
 * This catches any errors that might have been missed in route handlers.
 */
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Define the port to listen on. Default is 3000 if not specified in environment variables.
const PORT = process.env.PORT || 3000;

// Start the server and log that it's running.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
