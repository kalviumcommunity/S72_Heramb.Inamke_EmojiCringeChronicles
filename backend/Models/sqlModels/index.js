const sequelize = require('../../config/database');
const User = require('./User');
const EmojiCombo = require('./EmojiCombo');

// Define relationships
User.hasMany(EmojiCombo, {
  foreignKey: 'created_by',
  as: 'emojiCombos'
});

// Database sync function
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ SQL Database synchronized successfully');
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
    throw error;
  }
};

// Create seed data function
const seedDatabase = async () => {
  try {
    // Create test users
    const users = await User.bulkCreate([
      {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123'
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123'
      },
      {
        username: 'user3',
        email: 'user3@example.com',
        password: 'password123'
      }
    ], { individualHooks: true });

    // Create emoji combos for each user
    const combos = [
      {
        emojis: '😂🤣',
        description: 'Laughing so hard',
        created_by: users[0].id,
        username: users[0].username
      },
      {
        emojis: '🌟✨',
        description: 'Starry night',
        created_by: users[0].id,
        username: users[0].username
      },
      {
        emojis: '❤️💔',
        description: 'Love and heartbreak',
        created_by: users[1].id,
        username: users[1].username
      },
      {
        emojis: '🔥💦',
        description: 'Fire and water',
        created_by: users[1].id,
        username: users[1].username
      },
      {
        emojis: '🎵🎸',
        description: 'Music time',
        created_by: users[2].id,
        username: users[2].username
      },
      {
        emojis: '🍕🍔',
        description: 'Junk food',
        created_by: users[2].id, 
        username: users[2].username
      }
    ];

    await EmojiCombo.bulkCreate(combos);
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  EmojiCombo,
  syncDatabase,
  seedDatabase
}; 