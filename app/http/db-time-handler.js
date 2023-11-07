const db = require('../db/db')
module.exports = async function(req, res) {
  try {
    const result = await db.query("SELECT NOW()");
    if (result && result.rows.length > 0) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      // console.log(`result row 0: ${JSON.stringify(result.rows[0]['now'])}`);
      now = JSON.stringify(result.rows[0]['now']);
      now = now.substring(1, now.length-1);
      res.end(now);
    } else {
      console.log(`no time available from db`)
    }
  } catch(err) {
    console.log(`db-time error: ${JSON.stringify(err)}`);
    res.end()
  }
}