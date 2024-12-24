"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("wallet_transactions", "previousBalance", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });

    await queryInterface.addColumn("wallet_transactions", "newBalance", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("wallet_transactions", "previousBalance");
    await queryInterface.removeColumn("wallet_transactions", "newBalance");
  },
};
