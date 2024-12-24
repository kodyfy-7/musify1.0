const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");
const User = require("./User");
const UserAlbum = require("./UserAlbum");
const UserPlaylist = require("./UserPlaylist");

const UserPlaylistSong = postgresDb.define(
  "user_playlist_songs",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4(),
      unique: true,
      primaryKey: true,
    },
    userPlaylistId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    songId: {
      type: Sequelize.UUID,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

UserPlaylistSong.belongsTo(UserPlaylist, {
  as: "playlist",
  foreignKey: "userPlaylistId",
});

module.exports = UserPlaylistSong;
