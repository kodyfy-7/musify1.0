const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");

const ShowLoveCategory = postgresDb.define(
  "show_love_categories",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    emoji: {
      type: Sequelize.CHAR(4),
      allowNull: true,
    }
  },
  {
    paranoid: true,
  }
);

module.exports = ShowLoveCategory;
