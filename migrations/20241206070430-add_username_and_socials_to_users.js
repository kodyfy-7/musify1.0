'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'username', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('users', 'bio', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'twitterHandle', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'instagramHandle', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'otherLink', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'username');
    await queryInterface.removeColumn('users', 'bio');
    await queryInterface.removeColumn('users', 'twitterHandle');
    await queryInterface.removeColumn('users', 'instagramHandle');
    await queryInterface.removeColumn('users', 'otherLink');
  },
};
