'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('streams', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userSongId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      streamedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes
    await queryInterface.addIndex('streams', ['userSongId'], {
      name: 'idx_streams_userSongId',
    });

    await queryInterface.addIndex('streams', ['userId'], {
      name: 'idx_streams_userId',
    });

    await queryInterface.addIndex('streams', ['streamedAt'], {
      name: 'idx_streams_streamedAt',
    });

    // Composite index for optimized queries combining song and user
    await queryInterface.addIndex('streams', ['userSongId', 'userId'], {
      name: 'idx_streams_userSongId_userId',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('streams');
  },
};
