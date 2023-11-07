const Client = require('pg').Client;
require('dotenv').config();
let connection = null;
module.exports = {
  init: async function () {
    // test connection, report errors
    const config = {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    };
    const client = new Client(config)
    connection = await client.connect();
  },
  connect: async function () {
    if (!connection) {
      await this.init();
    }
    return connection;
  }
}
