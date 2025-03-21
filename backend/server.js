const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/api/auth', authRoutes);

// Default Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Database Connection with retry logic
const connectDatabase = async (retries = 5) => {
    if (!process.env.MONGO_URL) {
        console.error("❌ MONGO_URL is not set in .env file!");
        process.exit(1);
    }
    
    for (let i = 0; i < retries; i++) {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URL);
            console.log(`✅ Database connected: ${conn.connection.host}`);
            return;
        } catch (error) {
            console.error(`❌ Database connection attempt ${i + 1} failed:`, error.message);
            if (i === retries - 1) {
                console.error("❌ Max retries reached. Exiting...");
                process.exit(1);
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

// Graceful shutdown
const gracefulShutdown = async () => {
    try {
        await mongoose.connection.close();
        console.log('📝 MongoDB connection closed.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during graceful shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port http://localhost:${PORT}`);
    connectDatabase();
});