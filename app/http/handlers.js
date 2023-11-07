const handlers = {
  '/favicon.ico': require('./favicon-handler'),
  '/db-time': require('./db-time-handler'),
}



module.exports = handlers;