const handlers = {
  '/favicon.ico': require('./favicon-handler'),
  '/db-time': require('./db-time-handler'),
  '/api/bots': require('./api-bots-handler'),
  '/api/equipments': require('./api-equipments-handler'),
  '/api/botscripts': require('./api-botscripts-handler'),
}



module.exports = handlers;