const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");
const UserSong = require("./UserSong");

const Stream = postgresDb.define(
  "streams",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    userSongId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    streamedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "streams",
    paranoid: true,
  }
);


UserSong.hasMany(Stream, {
  as: "streams",
  foreignKey: "userSongId",
});

Stream.belongsTo(UserSong, {
  as: "song",
  foreignKey: "userSongId",
});

module.exports = Stream;
