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
      let {bot_id, equipment_id} = queryJson;
      // TODO: sterilize this search term
      // console.log(`search for ${search}, ${bot_id}, ${equipment_id}`);
      let whereClause = ``;
      const wheres = [];
      const tables = ['bot_equipment'];
      const fields = [`bot_equipment.*`];
      if (bot_id) {
        tables.push(`equipment`);
        fields.push(`equipment.*`)
        wheres.push(`bot_equipment.bot_id = '${bot_id}'`);
        wheres.push(`bot_equipment.equipment_id = equipment.equipment_id`);
      }
      if (equipment_id) {
        tables.push(`bot`);
        fields.push(`bot.*`)
        wheres.push(`bot_equipment.bot_id = '${bot_id}'`);
        wheres.push(`bot_equipment.bot_id = bot.bot_id`);
      }
      if (bot_id || equipment_id) {
        whereClause = `where ${wheres.join(' and ')}`;
      }

      sql = `SELECT ${fields.join(', ')} FROM ${tables.join(', ')} ${whereClause}`;
      const selectResult = await client.query(sql);
      if (selectResult.rows) {
        headers['Content-Type']='application/json';
        res.writeHead(200, headers)
        res.end(JSON.stringify(selectResult.rows));
        return;
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
      const {bot_id, equipment_id} = bodyJson;
      let selectResult = await client.query(
        ` SELECT * FROM bot_equipment 
          where equipment_id = '${equipment_id}' and 
          bot_id = '${bot_id}' 
        `
      );
      const alreadyRows = selectResult.rows;
      if (alreadyRows?.length > 0) {
        created = alreadyRows[0];
      } else {
        const bot_equipment_id = uuid.v4();
        const createResult = await client.query(
          `  INSERT INTO bot_equipment (bot_equipment_id, bot_id, equipment_id) 
             values ('${bot_equipment_id}', ${bot_id}','${equipment_id}')
        `);
        selectResult = await client.query(
          `SELECT * FROM bot_equipment where bot_equipment_id = '${bot_equipment_id}'`
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
      const {bot_equipment_id} = bodyJson;
      const selectResult = await client.query(
        `SELECT * FROM bot_equipment where bot_equipment_id = '${bot_equipment_id}'`
      );
      const deleteResult = await client.query(`
        DELETE from bot_equipment where bot_equipment_id = '${bot_equipment_id}'
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