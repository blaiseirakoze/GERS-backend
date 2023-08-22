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
    }
module.exports = config;