"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("fund_transactions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      funderId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      artisteId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("invest", "show love"),
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
    await queryInterface.addIndex("fund_transactions", ["funderId"], {
      name: "idx_fund_transactions_funderId",
    });

    await queryInterface.addIndex("fund_transactions", ["artisteId"], {
      name: "idx_fund_transactions_artisteId",
    });

    await queryInterface.addIndex("fund_transactions", ["type"], {
      name: "idx_fund_transactions_type",
    });

    await queryInterface.addIndex(
      "fund_transactions",
      ["funderId", "artisteId"],
      {
        name: "idx_fund_transactions_funderId_artisteId",
      }
    );

    await queryInterface.addIndex("fund_transactions", ["type", "createdAt"], {
      name: "idx_fund_transactions_type_createdAt",
    });

    await queryInterface.addIndex("fund_transactions", ["createdAt"], {
      name: "idx_fund_transactions_createdAt",
    });
    
    await queryInterface.addIndex(
      "fund_transactions",
      ["funderId", "artisteId", "type"],
      {
        name: "idx_fund_transactions_unique",
        unique: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("fund_transactions");
  },
};
