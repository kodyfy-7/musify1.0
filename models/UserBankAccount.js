const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");
const User = require("./User");

const UserBankAccount = postgresDb.define(
  "user_bank_accounts",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4(),
      unique: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    bankName: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    bankAccountName: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    bankAccountNumber: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    swiftCode: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    bvn: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

UserBankAccount.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});

module.exports = UserBankAccount;
