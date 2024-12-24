const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");
const User = require("./User");

const UserWallet = postgresDb.define(
  "user_wallets",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    balance: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
  },
  {
    paranoid: true,
  }
);

// User.hasMany(Follow, { foreignKey: 'followerId', as: 'following' });
// User.hasMany(Follow, { foreignKey: 'followedId', as: 'followers' });

// Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
// Follow.belongsTo(User, { foreignKey: 'followedId', as: 'followed' });

module.exports = UserWallet;
