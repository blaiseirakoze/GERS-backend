const dotenv = require('dotenv');

dotenv.config();

const config =
    {
      development : {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging:true
      },
      test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres"
      },
      production: {
        username: process.env.DB_USERNAME_PRO,
        // password: process.env.DB_PASSWORD_PRO,
        database: process.env.DB_NAME_PRO,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        dialect: "postgres"
      }
    }
module.exports = config;