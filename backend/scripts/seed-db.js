require('dotenv').config();
const { seedDatabase } = require('../Models/sqlModels');

// Seed the database without dropping tables
async function seed() {
  try {
    await seedDatabase();
    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seed(); 