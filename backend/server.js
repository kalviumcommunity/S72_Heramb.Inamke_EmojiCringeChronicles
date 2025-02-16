const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', routes);

// Simple Ping Route
app.get('/ping', (req, res) => {
    try {
        res.send('Pong!');
    } catch (error) {
        console.error("Error in /ping route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Database Connection
const connectDatabase = async () => {
    if (!process.env.MONGO_URL) {
        console.warn("⚠️  MONGO_URL is not set in .env file! Database connection will fail.");
        return;
    }
    
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, { ssl: true });
        console.log(`✅ Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1); // Exit process on failure
    }
};

// Start Server
const PORT = process.env.PORT || 3000;
if (!process.env.PORT) console.warn("⚠️ PORT is not set in .env. Using default port 3000");

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    connectDatabase(); // Connect after server starts
});
