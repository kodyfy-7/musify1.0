"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the unique index from fund_transactions
    await queryInterface.removeIndex("fund_transactions", "idx_fund_transactions_unique");
  },

  down: async (queryInterface, Sequelize) => {
    // Re-add the unique index if needed during rollback
    await queryInterface.addIndex(
      "fund_transactions",
      ["funderId", "artisteId", "type"],
      {
        name: "idx_fund_transactions_unique",
        unique: true,
      }
    );
  },
};
