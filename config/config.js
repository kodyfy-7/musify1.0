const dotenv = require("dotenv").config();

const {
  RDS_USERNAME,
  RDS_PASSWORD,
  RDS_DB_NAME,
  RDS_HOSTNAME,
  RDS_PORT,
  LOCAL_USERNAME,
  LOCAL_PASSWORD,
  LOCAL_DB_NAME,
  LOCAL_HOSTNAME,
  LOCAL_PORT,
  DIALECT,
  SEEDER_STORAGE
} = process.env;

module.exports = {
  development: {
    username: LOCAL_USERNAME,
    password: LOCAL_PASSWORD,
    database: LOCAL_DB_NAME,
    host: LOCAL_HOSTNAME,
    dialect: "postgres",
    logging: console.log,
    pool: {
      max: 100,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  },
  test: {
    username: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: RDS_DB_NAME,
    host: RDS_HOSTNAME,
    port: RDS_PORT,
    dialect: DIALECT,
    seederStorage: SEEDER_STORAGE,
    appPort: process.env.APP_PORT
  },
  staging: {
    username: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: RDS_DB_NAME,
    host: RDS_HOSTNAME,
    port: RDS_PORT,
    dialect: DIALECT,
    seederStorage: SEEDER_STORAGE,
    appPort: process.env.APP_PORT
  },
  production: {
    username: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: RDS_DB_NAME,
    host: RDS_HOSTNAME,
    port: RDS_PORT,
    dialect: DIALECT,
    seederStorage: SEEDER_STORAGE,
    appPort: process.env.APP_PORT
  }
};
