const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");
const User = require("./User");

const WalletTransaction = postgresDb.define(
  "wallet_transactions",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    walletId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM("deposit", "withdrawal"),
      allowNull: false,
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    previousBalance: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    newBalance: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },

    status: {
      type: Sequelize.ENUM("pending", "success", "failed"),
      allowNull: false,
    },
    referenceId: {
      type: Sequelize.STRING,
    },
    paymentMethod: {
      type: Sequelize.STRING,
    },
    accessCode: {
      type: Sequelize.STRING,
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

module.exports = WalletTransaction;
