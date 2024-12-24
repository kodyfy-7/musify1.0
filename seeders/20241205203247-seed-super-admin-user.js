"use strict";

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Find the Super Admin role
    const [superAdminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE slug = 'super-admin' LIMIT 1;`
    );

    if (!superAdminRole || superAdminRole.length === 0) {
      throw new Error("Super Admin role not found. Please seed roles first.");
    }

    const roleId = superAdminRole[0].id;

    // Seed a user with the Super Admin role
    const password = "superadminpassword"; // Comment the plain password in production

    await queryInterface.bulkInsert("users", [
      {
        id: uuidv4(),
        name: "Super Admin",
        email: "superadmin@example.com",
        emailVerifiedAt: new Date(),
        password: await bcrypt.hash(password, 10),
        rememberToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        roleId: roleId, // Assign the Super Admin role ID
        phoneNumber: "+1234567890",
        emailVerificationOtp: null,
        emailVerificationOtpExpireIn: null,
        passwordResetOtp: null,
        passwordResetOtpExpireIn: null,
        profileCompletionStatus: true,
      },
    ]);

    console.log("Super Admin user seeded successfully.");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { email: "superadmin@example.com" });
  },
};
