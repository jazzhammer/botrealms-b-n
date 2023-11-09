const handlers = {
  '/favicon.ico': require('./favicon-handler'),
  '/db-time': require('./db-time-handler'),
  '/api/bots': require('./api-bots-handler'),
  '/api/equipments': require('./api-equipments-handler'),
}



module.exports = handlers;