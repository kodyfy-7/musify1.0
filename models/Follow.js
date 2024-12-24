const Sequelize = require("sequelize");
const postgresDb = require("../database/PostgresDb");
const UserSong = require("./UserSong");
const User = require("./User");

const Follow = postgresDb.define(
  "follows",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    followerId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    followedId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
  },
  {
    paranoid: true,
  }
);


User.hasMany(Follow, { foreignKey: 'followerId', as: 'following' });
User.hasMany(Follow, { foreignKey: 'followedId', as: 'followers' });

Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
Follow.belongsTo(User, { foreignKey: 'followedId', as: 'followed' });

module.exports = Follow;
