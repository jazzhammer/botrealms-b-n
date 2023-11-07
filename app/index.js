require('dotenv').config();
const favicon = require('serve-favicon');
const fs = require('fs');
const path = require('path');
const http = require('http');
const init = require('./init/init');
const db = require('./db/db');

init.initdb();
// handlers
// default handlers:
const handlers = {
  '/favicon.ico': function(req, res) {
    let dir = path.join(__dirname);
    dir = dir.substring(0, dir.lastIndexOf('/'))
    const faviconPath = path.join(dir, 'assets/favicon.ico')
    try {
      const _favicon = favicon(faviconPath);
      _favicon(req, res, (err) =>{
        console.log(`error serving favicon: ${JSON.stringify(err)}`);
        res.end();
      });
    } catch(err) {
      console.log(`error serving favicon: ${JSON.stringify(err)}`);
      res.end()
    }
  }
}
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

