"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add columns
    await queryInterface.addColumn("wallet_transactions", "status", {
      type: Sequelize.ENUM("pending", "success", "failed"),
      allowNull: true,
    });

    await queryInterface.addColumn("wallet_transactions", "referenceId", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("wallet_transactions", "paymentMethod", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add indexes
    await queryInterface.addIndex("wallet_transactions", ["status"], {
      name: "idx_wallet_transactions_status",
    });

    await queryInterface.addIndex("wallet_transactions", ["referenceId"], {
      name: "idx_wallet_transactions_referenceId",
    });

    await queryInterface.addIndex("wallet_transactions", ["paymentMethod"], {
      name: "idx_wallet_transactions_paymentMethod",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex("wallet_transactions", "idx_wallet_transactions_status");
    await queryInterface.removeIndex("wallet_transactions", "idx_wallet_transactions_referenceId");
    await queryInterface.removeIndex("wallet_transactions", "idx_wallet_transactions_paymentMethod");

    // Remove columns
    await queryInterface.removeColumn("wallet_transactions", "status");
    await queryInterface.removeColumn("wallet_transactions", "referenceId");
    await queryInterface.removeColumn("wallet_transactions", "paymentMethod");
  },
};
