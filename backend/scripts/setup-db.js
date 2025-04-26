require('dotenv').config();
const mysql = require('mysql2/promise');
const { syncDatabase, seedDatabase } = require('../Models/sqlModels');

// Function to create database if it doesn't exist
async function createDatabase() {
  // Create a connection without specifying database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });

  console.log('✅ Connected to MySQL server');

  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
    console.log(`✅ Database '${process.env.DB_NAME}' created or already exists`);
  } catch (error) {
    console.error('❌ Error creating database:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Main function to set up the database
async function setupDatabase() {
  try {
    // Create database
    await createDatabase();
    
    // Sync Sequelize models with the database
    await syncDatabase(true); // true means force sync (drop tables if exist)
    
    // Seed the database with initial data
    await seedDatabase();
    
    console.log('✅ Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase(); 