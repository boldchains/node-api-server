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
const morgan = require('morgan'); // HTTP request logger middleware for node.js
const winston = require('./config/winston');
const socketIo = require('socket.io');

const routes = require('./track/routes');
const app = express();

// app middleware
app.use(morgan('combined', {stream: winston.stream }));
// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
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

io.on('connection', socket => {
  winston.info('Drone connected');
  emitDroneDataToClient(socket);
  socket.on('disconnect', () => winston.info('Drone disconnected'));
});

const emitDroneDataToClient = socket => {
  try {
    droneSockets.forEach((drone, i) => {
      drone.on(`from_${drones.params[i].id}`, data => {
        socket.emit('FromAPI', data);
      });
    });
  } catch(error) {
    winston.error(`Error: ${error.code}`);
  }
};

module.exports = {
  appHttpServer: appHttpServer
};
