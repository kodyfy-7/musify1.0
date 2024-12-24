"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the allowInvestment column
    await queryInterface.addColumn("user_songs", "allowInvestment", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    // Add the fundingGoal column
    await queryInterface.addColumn("user_songs", "fundingGoal", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    });

    // Add the fundingReason column
    await queryInterface.addColumn("user_songs", "fundingReason", {
      type: Sequelize.TEXT,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    });

    // Add indexes
    await queryInterface.addIndex("user_songs", ["allowInvestment"], {
      name: "idx_user_songs_allowInvestment",
    });
    await queryInterface.addIndex("user_songs", ["fundingGoal"], {
      name: "idx_user_songs_fundingGoal",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the allowInvestment column
    await queryInterface.removeColumn("user_songs", "allowInvestment");

    // Remove the fundingGoal column
    await queryInterface.removeColumn("user_songs", "fundingGoal");

    // Remove the fundingReason column
    await queryInterface.removeColumn("user_songs", "fundingReason");

    // Remove indexes
    await queryInterface.removeIndex("user_songs", "idx_user_songs_allowInvestment");
    await queryInterface.removeIndex("user_songs", "idx_user_songs_fundingGoal");
  },
};
