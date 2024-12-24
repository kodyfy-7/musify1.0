const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");
const User = require("./User");

const UserGenre = postgresDb.define(
  "user_genres",
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
    genreId: {
      type: Sequelize.UUID,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

UserGenre.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});

module.exports = UserGenre;
