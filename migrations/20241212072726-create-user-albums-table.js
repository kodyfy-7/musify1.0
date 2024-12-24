"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_albums", {
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
      title: {
        type: Sequelize.STRING(255),
      },
      description: {
        type: Sequelize.TEXT,
      },
      isPrivate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      coverImage: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.addIndex("user_albums", ["userId"], {
      name: "user_albums_userId_idx",
    });

    await queryInterface.addIndex("user_albums", ["title"], {
      name: "user_albums_title_idx",
    });

  },

  async down(queryInterface, Sequelize) {
    // Drop the table
    await queryInterface.dropTable("user_albums");
  },
};
