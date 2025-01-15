const express = require('express');
const app = express();
const port = 3000;

// Basic /ping route with error handling
app.get('/ping', (req, res, next) => {
  try {
    res.send('Pong');
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

// Catch-all error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
  });
});

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The resource at ${req.originalUrl} was not found on this server.`,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
