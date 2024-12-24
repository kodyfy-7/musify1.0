'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const updates = [
      { id: '742e33de-8a65-4164-b7bd-207a419f14a3', emoji: '🥰' },
      { id: '20f308b1-a72a-4cfd-9893-39d254b8b8ce', emoji: '😊' },
      { id: '65532fcf-0823-4fdb-be90-e454a33003d0', emoji: '😍' },
      { id: 'a3192ae5-921c-4136-9c95-3885fec93ee7', emoji: '🥳' },
      { id: '12913ad3-ef29-4acf-8fcc-f73e5888e7fd', emoji: '🔥' },
      { id: 'c8a0d9bc-a4d8-4dd1-8d28-1ca39d640e6d', emoji: '😲' },
      { id: '53bb9562-f7ea-4c5c-8195-39d801f1161e', emoji: '👌' },
      { id: 'dcefb752-40e4-4592-a4f0-0d305939ad75', emoji: '🔁' },
      { id: '13664417-db3b-4cc1-adad-7fdbc3f6d494', emoji: '😭' },
      { id: 'c5a5227b-e86d-4003-9afb-9fbe23520177', emoji: '🎤' },
    ];

    for (const update of updates) {
      await queryInterface.bulkUpdate(
        'show_love_categories', // Replace with your actual table name
        { emoji: update.emoji },
        { id: update.id }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // const ids = [
    //   'I dey with you',
    //   'I get you for mind',
    //   'I dey in luv',
    //   'I dey feel am',
    //   'Demm this is mad',
    //   'WOW',
    //   'This made sense',
    //   'e dey on repeat',
    //   'kuku kill us',
    //   'you dey sing abeg',
    // ];

    // await queryInterface.bulkUpdate(
    //   'show_love_categories', // Replace with your actual table name
    //   { emoji: null },
    //   { id: { [Sequelize.Op.in]: ids } }
    // );
  },
};
