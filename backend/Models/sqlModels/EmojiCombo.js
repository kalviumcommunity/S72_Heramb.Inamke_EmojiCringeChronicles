const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');

const EmojiCombo = sequelize.define('EmojiCombo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  emojis: { 
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  description: { 
    type: DataTypes.STRING(200), 
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'emoji_combos',
  timestamps: true,
  indexes: [
    {
      name: 'idx_created_by',
      fields: ['created_by']
    },
    {
      name: 'idx_created_at',
      fields: ['createdAt']
    }
  ]
});

// Define the association between EmojiCombo and User
EmojiCombo.belongsTo(User, { 
  foreignKey: 'created_by',
  as: 'creator'
});

// Add hook to validate that emoji combinations contain at least one emoji
EmojiCombo.beforeValidate((emojiCombo) => {
  const emojiRegex = /\p{Emoji}/gu;
  if (!emojiRegex.test(emojiCombo.emojis)) {
    throw new Error('Emoji combination must contain at least one emoji');
  }
  return emojiCombo;
});

module.exports = EmojiCombo; 