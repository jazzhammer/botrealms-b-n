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
        console.log(`search for ${search}`);
        sql = `select * from equipment where name like '%${search}%' or type like '%${search}%'`;
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
      const {name, type, description} = bodyJson;
      let selectResult = await client.query(
        `SELECT * FROM equipment where name = '${name}'`
      );
      const alreadyRows = selectResult.rows;
      if (alreadyRows?.length > 0) {
        created = alreadyRows[0];
      } else {
        const createResult = await client.query(`INSERT INTO equipment (name, type, description) values ('${name}','${type}','${description}')`);
        selectResult = await client.query(`SELECT * FROM equipment where name = '${name}'`);
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
      let bodyJson = JSON.parse(body);
      const {equipment_id, name, type, description} = bodyJson;
      const updateResult = await client.query(
        `UPDATE equipment set 
          name = '${name}', 
          type='${type}', 
          description='${description}' 
          where equipment_id = '${equipment_id}'`
      );
      const selectResult = await client.query(`SELECT * FROM equipment where equipment_id = '${equipment_id}'`);
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