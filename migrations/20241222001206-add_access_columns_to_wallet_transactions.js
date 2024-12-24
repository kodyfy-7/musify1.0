"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add columns
    await queryInterface.addColumn("wallet_transactions", "accessCode", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    // Add indexes
    await queryInterface.addIndex("wallet_transactions", ["accessCode"], {
      name: "idx_wallet_transactions_accessCode",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex("wallet_transactions", "idx_wallet_transactions_accessCode");
  },
};
