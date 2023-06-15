const dotenv = require('dotenv');

dotenv.config();

const config =
    {
      development : {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "mariadb",
        logging:true
      },
      test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_TEST,
        host: process.env.DB_HOST,
        dialect: "mariadb"
      },
      production: {
        username: process.env.DB_USERNAME_PRO,
        password: process.env.DB_PASSWORD_PRO,
        database: process.env.DB_NAME_PRO,
        host: process.env.DB_HOST,
        dialect: "mariadb"
      }
    }
module.exports = config;