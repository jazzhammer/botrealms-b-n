require('dotenv').config();
const init = require('./init/init');

const db = require('./db/db');

init.initdb();

const connection = db.connect();