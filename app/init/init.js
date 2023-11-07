const db = require('../db/db');

module.exports = {
  initdb: async function () {
    await db.init();
  }
}