require('dotenv').config();
const handlers = require('./http/handlers');
const fs = require('fs');
const path = require('path');
const http = require('http');
const init = require('./init/init');
const db = require('./db/db');

init.initdb();
run = async function() {
  const port = process.env.API_PORT;
  http.createServer(async (req, res) => {
    console.log(`url: ${req.url}`);
    handler = handlers[req.url];
    if (handler) {
      await handler(req, res);
    } else {
      res.writeHead(404, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST'
      });
      res.end();
    }
  }).listen(port || 5768, () => {
    console.log(`botrealms api listening at http://localhost:${port}`);
  });
}
run();

