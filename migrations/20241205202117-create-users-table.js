"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4(),
        unique: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      emailVerifiedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      rememberToken: {
        type: Sequelize.STRING(100),
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
      roleId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      phoneNumber: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      emailVerificationOtp: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      emailVerificationOtpExpireIn: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      passwordResetOtp: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      passwordResetOtpExpireIn: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      profileCompletionStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes
    await queryInterface.addIndex("users", ["email"], {
      unique: true,
      name: "users_email_unique_index",
    });

    await queryInterface.addIndex("users", ["roleId"], {
      name: "users_role_id_index",
    });

    await queryInterface.addIndex("users", ["phoneNumber"], {
      name: "users_phone_number_index",
    });

    await queryInterface.addIndex("users", ["profileCompletionStatus"], {
      name: "users_profile_completion_status_index",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes first
    await queryInterface.removeIndex("users", "users_email_unique_index");
    await queryInterface.removeIndex("users", "users_role_id_index");
    await queryInterface.removeIndex("users", "users_phone_number_index");
    await queryInterface.removeIndex("users", "users_profile_completion_status_index");

    // Drop the table
    await queryInterface.dropTable("users");
  },
};
