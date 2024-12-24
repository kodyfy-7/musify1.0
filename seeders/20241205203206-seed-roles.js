"use strict";

const { v4: uuidv4 } = require("uuid");

/** Utility to generate a slug from a string */
const generateSlug = (name) => name.toLowerCase().replace(/\s+/g, "-");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("roles", [
      {
        id: uuidv4(),
        name: "Super Admin",
        slug: generateSlug("Super Admin"),
        description: "Has full access to all resources",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Admin",
        slug: generateSlug("Admin"),
        description: "Manages specific resources",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Investor",
        slug: generateSlug("Investor"),
        description: "Has access to financial dashboards and reports",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Artiste",
        slug: generateSlug("Artiste"),
        description: "Can upload and manage creative content",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
