const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");
const User = require("./User");
const UserSong = require("./UserSong");
const ShowLoveCategory = require("./ShowLoveCategory");

const FundTransaction = postgresDb.define(
  "fund_transactions",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    funderId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    artisteId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    songId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM("invest", "show love"), // if invest, create an investment table to track roi
      allowNull: false,
    },
    showLoveId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
  },
  {
    paranoid: true,
  }
);

User.hasMany(FundTransaction, { foreignKey: 'funderId', as: 'funderTransactions' });
User.hasMany(FundTransaction, { foreignKey: 'artisteId', as: 'artisteTransactions' });

FundTransaction.belongsTo(User, { foreignKey: 'funderId', as: 'funder' });
FundTransaction.belongsTo(User, { foreignKey: 'artisteId', as: 'artiste' });

FundTransaction.belongsTo(UserSong, { foreignKey: 'songId', as: 'song' });

FundTransaction.belongsTo(ShowLoveCategory, { foreignKey: 'showLoveId', as: 'category' });

module.exports = FundTransaction;
