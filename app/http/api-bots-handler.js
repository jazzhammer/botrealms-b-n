const db = require('../db/db');
const {Client} = require("pg");

module.exports = async function(req, res) {
  let headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST'
  };
  if (req.method === 'POST') {
    const client = new Client(db.config)
    await client.connect();
    try {
      let created = null;

      async function readRequestBody(request) {
        return new Promise((resolve, reject) => {
          let body = '';
          request.on('data', (chunk) => {
            body += chunk;
          });
          request.on('end', () => {
            resolve(body);
          });
        });
      }

      const body = await readRequestBody(req);
      bodyJson = JSON.parse(body);
      const name = bodyJson.name;
      let selectResult = await client.query(`SELECT * FROM bots where name = '${name}'`);
      const alreadyRows = selectResult.rows;
      if (alreadyRows?.length > 0) {
        created = alreadyRows[0];
      } else {
        const createResult = await client.query(`INSERT INTO bots (name) values ('${name}')`);
        selectResult = await client.query(`SELECT * FROM bots where name = '${name}'`);
        const selectRows = selectResult.rows;
        if (selectRows) {
          created = selectRows[0];
        }
      }
      if (created) {
        headers = {
          ... headers,
          'Content-Type': 'application/json'
        }
        res.writeHead(201, headers)
        res.end(JSON.stringify(created));
        return;
      } else {
        res.writeHead(500, headers);
        res.end('unable to create resource.');
      }
    } catch (err) {
      res.writeHead(500, headers)
      res.end();
    } finally {
      client.end();
    }
  } else {
    res.writeHead(404, headers);
    res.end();
  }
}