///////////////////  SIMULATED DRONES DATA RECEIVER ////////////////////////////////
const socketIOClient = require('socket.io-client');
const drones = require('./droneParams');

const droneSockets = [];
drones.params.forEach(param => {
  let socket = socketIOClient(`http://${param.hostname}:${param.port}`);
  droneSockets.push(socket);
});


///////////////////////  DRONE SERVER SETUP //////////////////////////
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const routes = require('./track/routes');
//const port = process.env.PORT || 4001;
const app = express();

// app middleware
app.use(cors());
app.use(bodyParser.json({type: 'application/json'}));
app.disable('etag');

app.use('/', routes());

app.use((err, req, res, next) => {
  if(err.validator) {
    err.name = 'ValidationError';
    err.code = 400;
  }
  next(err);
});

const appHttpServer = http.createServer(app);
const io = socketIo(appHttpServer);

//const freq = 1000
io.on('connection', socket => {
  //console.log('Drone connected');
  //setInterval(() => emitDroneDataToClient(socket), freq)
  emitDroneDataToClient(socket);
  //socket.on('disconnect', () => console.log('Drone disconnected'));
});

const emitDroneDataToClient = socket => {
  try {
    droneSockets.forEach((drone, i) => {
      drone.on(`from_${drones.params[i].id}`, data => {
        socket.emit('FromAPI', data);
      });
    });
  } catch(error) {
    //console.error(`Error: ${error.code}`);
  }
};

module.exports = {
  appHttpServer: appHttpServer
};
