'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('follows', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      followerId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      followedId: {
        type: Sequelize.UUID,
        allowNull: false,
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
    await queryInterface.addIndex('follows', ['followedId'], {
      name: 'idx_follows_followedId',
    });

    await queryInterface.addIndex('follows', ['followerId'], {
        name: 'idx_follows_followerId',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('follows');
  },
};
