const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");
const User = require("./User");
const UserSong = require("./UserSong");

const UserAlbum = postgresDb.define(
  "user_albums",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4(),
      unique: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(255),
    },
    description: {
      type: Sequelize.TEXT,
    },
    isPrivate: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    coverImage: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    allowInvestment: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fundingGoal: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    fundingReason: {
      type: Sequelize.TEXT,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },    
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

UserAlbum.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});

module.exports = UserAlbum;
