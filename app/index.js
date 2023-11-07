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
  http.createServer((req, res) => {
    // console.log(`url: ${req.url}`);
    handler = handlers[req.url];
    if (handler) {
      handler(req, res);
    } else {
      res.end();
    }
  }).listen(port || 5768, () => {
    console.log(`botrealms api listening at http://localhost:${port}`);
  });
}
run();

