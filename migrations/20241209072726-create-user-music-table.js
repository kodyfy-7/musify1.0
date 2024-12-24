"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_music", {
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
      musicUrl: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex("user_music", ["userId"], {
      name: "user_music_userId_idx",
    });

    await queryInterface.addIndex("user_music", ["title"], {
      name: "user_music_title_idx",
    });

    await queryInterface.addIndex("user_music", ["musicUrl"], {
        name: "user_music_url_idx",
      });
  },

  async down(queryInterface, Sequelize) {
    // Drop the table
    await queryInterface.dropTable("user_music");
  },
};
