"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_genres", {
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
      genreId: {
        type: Sequelize.UUID,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes
    await queryInterface.addIndex("user_genres", ["userId"], {
      name: "user_genres_userId_idx",
    });

    await queryInterface.addIndex("user_genres", ["genreId"], {
      name: "user_genres_genreId_idx",
    });

  },

  async down(queryInterface, Sequelize) {
    // Drop the table
    await queryInterface.dropTable("user_genres");
  },
};
