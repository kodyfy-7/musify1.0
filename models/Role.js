const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");

const Role = postgresDb.define(
  "roles",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "roles",
  }
);

module.exports = Role;
