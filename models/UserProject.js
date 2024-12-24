const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");
const User = require("./User");

const UserProject = postgresDb.define(
  "user_projects",
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
    goal: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

UserProject.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});

module.exports = UserProject;
