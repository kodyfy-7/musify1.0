"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_songs", {
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
      userAlbumId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      isPrivate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      coverImage: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      filePath: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    await queryInterface.addIndex("user_songs", ["userId"], {
      name: "user_songs_userId_idx",
    });

    await queryInterface.addIndex("user_songs", ["title"], {
      name: "user_songs_title_idx",
    });

    await queryInterface.addIndex("user_songs", ["userAlbumId"], {
      name: "user_songs_userAlbumId_idx",
    });

    await queryInterface.addIndex("user_songs", ["filePath"], {
      name: "user_songs_filePath_idx",
    });

    await queryInterface.addIndex("user_songs", ["isPrivate"], {
      name: "user_songs_isPrivate_idx",
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the table
    await queryInterface.dropTable("user_songs");
  },
};
