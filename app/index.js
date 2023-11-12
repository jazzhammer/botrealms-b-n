require('dotenv').config();
const socketio = require('socket.io');
const handlers = require('./http/handlers');
const fs = require('fs');
const path = require('path');
const http = require('http');
const init = require('./init/init');
const db = require('./db/db');
const url = require('url');

init.initdb();

run = async function() {
  const port = process.env.API_PORT;
  const websocket_port = process.env.WEBSOCKET_PORT;

  http.createServer(async (req, res) => {
    const pathname = url.parse(req.url).pathname;
    console.log(`pathname: ${pathname}`);
    handler = handlers[pathname];
    if (handler) {
      await handler(req, res);
    } else {
      res.writeHead(404, {
        'Access-Control-Allow-Origin': process.env.ALLOW_ORIGIN || '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST'
      });
      res.end();
    }
  }).listen(port || 5768, () => {
    console.log(`botrealms api listening at http://localhost:${port}`);
  });

  const io = socketio(
    websocket_port,
    {
      cors: {
        origin: "http://localhost:3000"
      }
    }
  );
  io.on('connection', socket => {
    console.log(`socket ! id: ${socket.id}`);
    socket.on('instruction', (obj) => {
      console.log(`instruction received from id:'${socket.id}: ${JSON.stringify(obj)}`);
      socket.emit('realm-data', {
        sensors: [
          { equipmentId: 'oiurqieru',
            sensorId: 'asdf',
            data: [
              {
                x: 24,
                y: 322
              },
            ],
          },
        ]
      }, socket.id);
    });
  });
}

run();

