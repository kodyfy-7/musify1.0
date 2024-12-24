"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the allowInvestment column
    await queryInterface.addColumn("user_albums", "allowInvestment", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    // Add the fundingGoal column
    await queryInterface.addColumn("user_albums", "fundingGoal", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    });

    // Add the fundingReason column
    await queryInterface.addColumn("user_albums", "fundingReason", {
      type: Sequelize.TEXT,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    });

    // Add indexes
    await queryInterface.addIndex("user_albums", ["allowInvestment"], {
      name: "idx_user_albums_allowInvestment",
    });
    await queryInterface.addIndex("user_albums", ["fundingGoal"], {
      name: "idx_user_albums_fundingGoal",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the allowInvestment column
    await queryInterface.removeColumn("user_albums", "allowInvestment");

    // Remove the fundingGoal column
    await queryInterface.removeColumn("user_albums", "fundingGoal");

    // Remove the fundingReason column
    await queryInterface.removeColumn("user_albums", "fundingReason");

    // Remove indexes
    await queryInterface.removeIndex("user_albums", "idx_user_albums_allowInvestment");
    await queryInterface.removeIndex("user_albums", "idx_user_albums_fundingGoal");
  },
};
