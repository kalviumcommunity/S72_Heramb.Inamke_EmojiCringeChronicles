const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const sqlRoutes = require('./routes/sqlRoutes');
const { syncDatabase, seedDatabase } = require('./Models/sqlModels');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', routes); // MongoDB routes
app.use('/api/auth', authRoutes); // MongoDB auth routes
app.use('/api/sql', sqlRoutes); // MySQL routes

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

// MongoDB Connection with retry logic
const connectMongoDatabase = async (retries = 5) => {
    if (!process.env.MONGO_URL) {
        console.error("❌ MONGO_URL is not set in .env file!");
        process.exit(1);
    }
    
    for (let i = 0; i < retries; i++) {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URL);
            console.log(`✅ MongoDB connected: ${conn.connection.host}`);
            return;
        } catch (error) {
            console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, error.message);
            if (i === retries - 1) {
                console.error("❌ Max retries reached. Exiting...");
                process.exit(1);
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

// Initialize both databases
const initializeDatabases = async () => {
    try {
        // Connect to MongoDB
        await connectMongoDatabase();
        
        // Sync MySQL database
        await syncDatabase(false);  // false means don't drop tables
        
        // Check if we need to seed the database (only in development)
        if (process.env.NODE_ENV === 'development') {
            // Check if database is empty before seeding
            const { User } = require('./Models/sqlModels');
            const userCount = await User.count();
            
            if (userCount === 0) {
                console.log('📝 Seeding database with initial data...');
                await seedDatabase();
            } else {
                console.log('📝 Database already has data, skipping seed');
            }
        }
    } catch (error) {
        console.error('❌ Error initializing databases:', error);
        process.exit(1);
    }
};

// Graceful shutdown
const gracefulShutdown = async () => {
    try {
        await mongoose.connection.close();
        console.log('📝 MongoDB connection closed.');
        
        const { sequelize } = require('./Models/sqlModels');
        await sequelize.close();
        console.log('📝 MySQL connection closed.');
        
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
    initializeDatabases();
});