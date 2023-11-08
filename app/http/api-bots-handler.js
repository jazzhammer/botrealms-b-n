const db = require('../db/db');
module.exports = async function(req, res) {
  let headers = {
    'Access-Control-Allowed-Origin': '*',
    'Access-Control-Allowed-Methods': 'POST'
  };
  if (req.method === 'POST') {
    try {
      const name = req.body.name;
      db.query(`SELECT * FROM bots where name = '${name}'`)
      if (created) {
        headers = {
          ... headers,
          'Content-Type': 'application/json'
        }
        res.writeHead(201, headers)

        res.end(JSON.stringify(result));
      } else {

      }
    } catch (err) {
      res.writeHead(500, headers)
      res.end();
    }
x  } else {
    res.writeHead(404, headers);
    res.end();
  }
}