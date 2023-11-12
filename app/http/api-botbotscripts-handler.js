const db = require('../db/db');
const {Client} = require("pg");
const url = require('url');
const querystring = require('querystring');
const uuid = require('uuid');

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
    const client = new Client(db.config)
    await client.connect();
    try {
      const parsed = url.parse(req.url);
      const query = parsed.query;
      const queryJson = querystring.parse(query);
      let {search, bot_id, botscript_id} = queryJson;
      search = search.trim();
      if (search.length > 0) {
        // TODO: sterilize this search term
        console.log(`search for ${search}, ${bot_id}, ${botscript_id}`);
        let whereClause = ``;
        if (bot_id || botscript_id) {
          whereClause = `where `;
          whereClause += bot_id ? `bot_id = '${bot_id}'` : ``;
          whereClause += botscript_id ? `bot_id = '${botscript_id}'` : ``;
        }
        sql = `select * from botbotscript ${whereClause}}`;
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
      const {bot_id, botscript_id} = bodyJson;
      let selectResult = await client.query(
        ` SELECT * FROM botbotscript 
          where botscript_id = '${botscript_id}' and 
          bot_id = '${bot_id}' 
        `
      );
      const alreadyRows = selectResult.rows;
      if (alreadyRows?.length > 0) {
        created = alreadyRows[0];
      } else {
        const botbotscript_id = uuid.v4();
        const createResult = await client.query(
          `  INSERT INTO botbotscript (botbotscript_id, bot_id, botscript_id) 
             values ('${botbotscript_id}', ${bot_id}','${botscript_id}')
        `);
        selectResult = await client.query(
          `SELECT * FROM botbotscript where botbotscript_id = '${botbotscript_id}'`
        );
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
  else if (req.method === 'DELETE') {
    const client = new Client(db.config)
    await client.connect();
    try {
      let deleted = null;

      const body = await readRequestBody(req);
      let bodyJson = JSON.parse(body);
      const {botbotscript_id} = bodyJson;
      const selectResult = await client.query(
        `SELECT * FROM botbotscript where botbotscript_id = '${botbotscript_id}'`
      );
      const deleteResult = await client.query(`
        DELETE from botbotscript where botbotscript_id = '${botbotscript_id}'
      `);
      const selectRows = selectResult.rows;
      if (selectRows) {
        deleted = selectRows[0];
      }
      if (deleted) {
        headers = {
          ... headers,
          'Content-Type': 'application/json'
        }
        res.writeHead(200, headers)
        res.end(JSON.stringify(deleted));
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