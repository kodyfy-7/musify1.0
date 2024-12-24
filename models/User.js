const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");
const Role = require("./Role");

const User = postgresDb.define(
  "users",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4(),
      unique: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    username: {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true,
    },
    bio: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    twitterHandle: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    instagramHandle: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    otherLink: {
      type: Sequelize.STRING(255),
      allowNull: true,
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
    genre: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    profileImage: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    profileHeader: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

User.belongsTo(Role, {
  as: "role",
  foreignKey: "roleId",
});

module.exports = User;
