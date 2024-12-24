"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the emoji column
    await queryInterface.addColumn("show_love_categories", "emoji", {
      type: Sequelize.CHAR(4), // Fixed length for emojis
      allowNull: true,
    });

    // Add an index on the emoji column for faster searches
    await queryInterface.addIndex("show_love_categories", ["emoji"], {
      name: "idx_show_love_categories_emoji", // Index name
      unique: false, // Set to true if emojis must be unique
    });

    await queryInterface.addIndex("show_love_categories", ["amount"], {
      name: "idx_show_love_categories_amount",
    });

    // Optionally add another index on the title column (if not already indexed)
    await queryInterface.addIndex("show_love_categories", ["title"], {
      name: "idx_show_love_categories_title", // Index name
      unique: true, // Assuming titles should be unique
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the indexes
    await queryInterface.removeIndex(
      "show_love_categories",
      "idx_show_love_categories_emoji"
    );
    await queryInterface.removeIndex(
      "show_love_categories",
      "idx_show_love_categories_title"
    );

    // Remove the emoji column
    await queryInterface.removeColumn("show_love_categories", "emoji");
  },
};
