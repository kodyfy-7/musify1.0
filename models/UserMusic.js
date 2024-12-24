const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");
const User = require("./User");

const UserMusic = postgresDb.define(
  "user_music",
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
    musicUrl: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "user_music",
    timestamps: true,
    paranoid: true,
  }
);

UserMusic.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});

module.exports = UserMusic;
