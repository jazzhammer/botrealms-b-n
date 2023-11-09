require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Client = require('pg').Client;

const config = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

module.exports = {
  config,
  init: async function () {
    // test connection, report errors
    const client = new Client(config)
    await client.connect();
    console.log(`migrations from ${__dirname}...`);
    const dir = fs.readdirSync(__dirname);
    for (const entry of dir) {
      if (entry.includes('-migration-') && entry.endsWith('.sql')) {
        try {
          console.log(`migration: ${entry}`);
          const sql = fs.readFileSync(path.join(__dirname, entry), {encoding: 'utf8'});
          await client.query({
            text: sql
          }).then(
            (result) => {
              // console.log(`result from ${entry}: ${JSON.stringify(result)}`);
            },
            (err) => {
              console.log(`error migrating with ${entry}: ${JSON.stringify(err)}`);
            }
            );
        } catch (err) {
          console.log(`error migrating with ${entry}: ${JSON.stringify(err)}`);
        }
      }
    }
    client.end();
  }
}
