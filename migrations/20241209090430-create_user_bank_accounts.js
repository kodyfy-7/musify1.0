"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_bank_accounts", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      bankName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      bankAccountName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      bankAccountNumber: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      swiftCode: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      bvn: {
        type: Sequelize.STRING(255),
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
    await queryInterface.addIndex("user_bank_accounts", ["userId"], {
      name: "user_bank_accounts_userId_idx",
    });

    await queryInterface.addIndex("user_bank_accounts", ["bankAccountNumber"], {
      name: "user_bank_accounts_bankAccountNumber_idx",
    });

    await queryInterface.addIndex("user_bank_accounts", ["swiftCode"], {
      name: "user_bank_accounts_swiftCode_idx",
    });

    await queryInterface.addIndex("user_bank_accounts", ["bvn"], {
      name: "user_bank_accounts_bvn_idx",
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop indexes before dropping the table (optional for Sequelize, but good practice)
    await queryInterface.removeIndex("user_bank_accounts", "user_bank_accounts_userId_idx");
    await queryInterface.removeIndex("user_bank_accounts", "user_bank_accounts_bankAccountNumber_idx");
    await queryInterface.removeIndex("user_bank_accounts", "user_bank_accounts_swiftCode_idx");
    await queryInterface.removeIndex("user_bank_accounts", "user_bank_accounts_bvn_idx");

    // Drop the table
    await queryInterface.dropTable("user_bank_accounts");
  },
};
