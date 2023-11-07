require('dotenv').config();

const Client = require('pg').Client;

const config = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

module.exports = {
  init: async function () {
    // test connection, report errors
    const client = new Client(config)
    await client.connect();
    client.end();
  },
  query: async function (sql, values) {
    const client = new Client(config)
    await client.connect();
    const result = values ? await client.query(sql, values) : await client.query(sql);
    client.end();
    return result;
  }
}
