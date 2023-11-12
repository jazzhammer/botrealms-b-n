const db = require('../db/db');
const {Client} = require("pg");
const url = require('url');
const querystring = require('querystring');

module.exports = async function(req, res) {

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

  let headers = {
    'Access-Control-Allow-Origin': process.env.ALLOW_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, PUT, PATCH, DELETE, GET',
    'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
  };
  if (req.method === 'GET') {
    // TODO: use a pool
    const client = new Client(db.config)
    await client.connect();
    try {
      const parsed = url.parse(req.url);
      const query = parsed.query;
      const queryJson = querystring.parse(query);
      let {search} = queryJson;
      search = search.trim();
      if (search.length > 0) {
        // TODO: sterilize this search term
        sql = `select * from bot where name like '%${search}%'`;
        const selectResult = await client.query(sql);
        if (selectResult.rows) {
          headers['Content-Type']='application/json';
          res.writeHead(200, headers)
          res.end(JSON.stringify(selectResult.rows));
          return;
        }
      }
      res.writeHead(404, headers);
      res.end();
    } finally {
      client.end();
    }
  }
  else if (req.method === 'POST') {
    const client = new Client(db.config)
    await client.connect();
    try {
      let created = null;

      const body = await readRequestBody(req);
      bodyJson = JSON.parse(body);
      const name = bodyJson.name;
      let selectResult = await client.query(`SELECT * FROM bot where name = '${name}'`);
      const alreadyRows = selectResult.rows;
      if (alreadyRows?.length > 0) {
        created = alreadyRows[0];
      } else {
        const createResult = await client.query(`INSERT INTO bot (name) values ('${name}')`);
        selectResult = await client.query(`SELECT * FROM bot where name = '${name}'`);
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
  }
  else if (req.method === 'OPTIONS') {
    headers = {
      ... headers,
    }
    res.writeHead(200, headers);
    res.end();
  }
  else if (req.method === 'PUT') {
    const client = new Client(db.config)
    await client.connect();
    try {
      let updated = null;

      const body = await readRequestBody(req);
      bodyJson = JSON.parse(body);
      const {bot_id, name} = bodyJson;
      const updateResult = await client.query(`UPDATE bot set name = '${name}' where bot_id = '${bot_id}'`);
      const selectResult = await client.query(`SELECT * FROM bot where bot_id = '${bot_id}'`);
      const selectRows = selectResult.rows;
      if (selectRows) {
        updated = selectRows[0];
      }
      if (updated) {
        headers = {
          ... headers,
          'Content-Type': 'application/json'
        }
        res.writeHead(201, headers)
        res.end(JSON.stringify(updated));
        return;
      } else {
        res.writeHead(500, headers);
        res.end('unable to commit resource change');
      }
    } catch (err) {
      res.writeHead(500, headers)
      res.end();
    } finally {
      client.end();
    }
  }
  else {
    res.writeHead(404, headers);
    res.end();
  }
}