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
    // TODO: use pool
    const client = new Client(config)
    await client.connect();
    try {
      console.log(`migrations from ${__dirname}/<nnn>-migration-*.sql...`);
      const dir = fs.readdirSync(__dirname);
      for (const entry of dir) {
        if (entry.includes('-migration-') && entry.endsWith('.sql')) {
          try {
            // console.log(`migration: ${entry}`);
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
    } finally {
      client.end();
    }
  },
  seed: async function () {
    // TODO: use pool
    const client = new Client(config)
    await client.connect();
    try {
      const seedPath = path.join(__dirname, 'seed.json');
      console.log(`seeds from ${seedPath} ...`);
      const seed = fs.readFileSync(seedPath);
      seeds = JSON.parse(seed);
      for (const seed of seeds) {
        const table = seed['table'];
        const inserts = seed['inserts'];
        for (const insert of inserts) {
          const pairStrings = [];
          const names = [];
          const values = [];
          const fields = insert['fields'];
          for (const field of fields) {
            pairString = `${field.name} = ${field.value} `
            pairStrings.push(pairString);
            names.push(field.name);
            values.push(field.value);
          }

          // insert if does the row doesn't exist
          const sql = `SELECT * from ${table} where ${pairStrings.join(' and ')} `;
          // console.log(sql);
          const selectResult = await client.query(sql);
          if (!selectResult.rows || selectResult.rows.length === 0 ) {
            const insertSql = `INSERT INTO ${table} (${names.join(', ')}) values (${values.join(', ')})`
            await client.query(insertSql);
          }
        }
      }
    } finally {
      client.end();
    }
  }
}
