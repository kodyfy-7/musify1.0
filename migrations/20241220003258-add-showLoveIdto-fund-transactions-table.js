"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("fund_transactions", "showLoveId", {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
  },
};
