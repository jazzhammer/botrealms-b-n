const db = require('../db/db')
module.exports = async function(req, res) {
  try {
    const result = await db.query("SELECT NOW()");
    if (result && result.rows.length > 0) {
      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allowed-Origin': process.env.ALLOW_ORIGIN || '*',
        'Access-Control-Allowed-Methods': 'GET'
      })
      now = JSON.stringify(result.rows[0]['now']).substring(1, now.length-1);
      res.end(now);
    } else {
      console.log(`no time available from db`)
    }
  } catch(err) {
    console.log(`db-time error: ${JSON.stringify(err)}`);
    res.end()
  }
}