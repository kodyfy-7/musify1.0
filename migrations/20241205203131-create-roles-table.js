"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roles", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING(500),
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
    await queryInterface.addIndex("roles", ["name"], {
      unique: true,
      name: "roles_name_unique_index",
    });
    await queryInterface.addIndex("roles", ["slug"], {
      unique: true,
      name: "roles_slug_unique_index",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("roles", "roles_name_unique_index");
    await queryInterface.removeIndex("roles", "roles_slug_unique_index");
    await queryInterface.dropTable("roles");
  },
};
