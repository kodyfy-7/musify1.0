'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('show_love_categories', [
      { id: uuidv4(), title: 'I dey with you', amount: 10000, emoji: '🥰', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: 'I get you for mind', amount: 5000, emoji: '😊', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: 'I dey in luv', amount: 25000, emoji: '😍', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: 'I dey feel am', amount: 15000, emoji: '🥳', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: 'Demm this is mad', amount: 30000, emoji: '🔥', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: 'WOW', amount: 35000, emoji: '😲', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: 'This made sense', amount: 40000, emoji: '👌', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: 'e dey on repeat', amount: 45000, emoji: '🔁', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: 'kuku kill us', amount: 50000,  emoji: '😭', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), title: 'you dey sing abeg', amount: 20000, emoji: '🎤', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('show_love_categories', null, {});
  },
};
