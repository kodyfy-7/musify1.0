const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");
const User = require("./User");
const UserAlbum = require("./UserAlbum");

const UserPlaylist = postgresDb.define(
  "user_playlists",
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
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

UserPlaylist.belongsTo(User, {
  as: "artiste",
  foreignKey: "userId",
});

module.exports = UserPlaylist;
