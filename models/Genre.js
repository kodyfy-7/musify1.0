const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");

const Genre = postgresDb.define(
  "genres",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4(),
      unique: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    colour: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Genre;
