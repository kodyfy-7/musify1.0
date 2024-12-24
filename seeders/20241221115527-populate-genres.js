"use strict";
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('genres', [
      { id: uuidv4(), title: "Pop", colour: "#FF5733", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Rock", colour: "#C70039", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Jazz", colour: "#900C3F", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Classical", colour: "#34495E", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Hip-Hop", colour: "#1ABC9C", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Electronic", colour: "#8E44AD", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Country", colour: "#FFC300", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Reggae", colour: "#DAF7A6", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Blues", colour: "#581845", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Soul", colour: "#E74C3C", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "R&B", colour: "#2ECC71", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Funk", colour: "#F1C40F", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Punk", colour: "#E67E22", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Metal", colour: "#7D3C98", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Gospel", colour: "#3498DB", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Latin", colour: "#F39C12", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Disco", colour: "#A569BD", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Folk", colour: "#5D6D7E", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "World", colour: "#28B463", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: "Alternative", colour: "#9B59B6", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Delete all records from genres table
    await queryInterface.bulkDelete("genres", null, {});
  },
};
