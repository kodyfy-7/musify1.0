const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");
const User = require("./User");
const UserAlbum = require("./UserAlbum");

const UserSong = postgresDb.define(
  "user_songs",
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
    userAlbumId: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    isPrivate: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    coverImage: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    filePath: {
      type: Sequelize.TEXT,
      allowNull: false,
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

UserSong.belongsTo(User, {
  as: "artiste",
  foreignKey: "userId",
});

UserSong.belongsTo(UserAlbum, {
  as: "album",
  foreignKey: "userAlbumId",
});

UserAlbum.hasMany(UserSong, {
  as: "songs",
  foreignKey: "userAlbumId",
});

module.exports = UserSong;
