"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("wallet_transactions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
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
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes
    await queryInterface.addIndex("wallet_transactions", ["walletId"], {
      name: "idx_wallet_transactions_walletId",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("wallet_transactions");
  },
};
