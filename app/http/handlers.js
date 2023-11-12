const handlers = {
  '/favicon.ico': require('./favicon-handler'),
  '/db-time': require('./db-time-handler'),
  '/api/bots': require('./api-bots-handler'),
  '/api/equipments': require('./api-equipments-handler'),
  '/api/botscripts': require('./api-botscripts-handler'),
  '/api/realms': require('./api-realms-handler'),
  '/api/bot_equipments': require('./api-botequipments-handler'),
}



module.exports = handlers;