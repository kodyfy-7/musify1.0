"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_playlist_songs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4(),
        unique: true,
        primaryKey: true,
      },
      userPlaylistId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      songId: {
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
    await queryInterface.addIndex("user_playlist_songs", ["userPlaylistId"], {
      name: "user_playlist_songs_userPlaylistId_idx",
    });

    await queryInterface.addIndex("user_playlist_songs", ["songId"], {
      name: "user_playlist_songs_songId_idx",
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the table
    await queryInterface.dropTable("user_playlist_songs");
  },
};
