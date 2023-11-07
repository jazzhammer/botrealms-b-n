const db = require('../db/db');

module.exports = {
  initdb: function() {
    db.init();
  }
}