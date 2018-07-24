const http = require('http');
const socketIo = require ('socket.io');
const random = require('./randomize');
const winston = require('../config/winston');

exports.simulate = (data) => {
  let id = data.id;
  let hostname = data.hostname;
  let port = data.port;
  let freq = data.freq;

  //let server = http.createServer().listen(port);

  let server = http.createServer().listen(port, hostname, () => {
    //console.log(`Drone# ${id} active at http://${hostname}:${port}/`)
    winston.info(`Drone# ${id} active at http://${hostname}:${port}/`);
  });


  let io = socketIo(server);
  let interval = null;
  io.on('connection', socket => {
    //console.log(`Drone# ${id} connected`);
    winston.info(`Drone# ${id} connected`);
    if(interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => emitGeoLocation(socket, id), freq);
    //socket.on('disconnect', () => console.log('Drone disconnected'));
    socket.on('disconnect', () => winston.info('Drone disconnected'));
  });
};

const emitGeoLocation = (socket, id) => {
  try {
    socket.emit(`from_${id}`, randomData(id));
  } catch(error) {
    //console.error(`Error: ${error} - Drone# ${id}`);
    winston.error(`Error: ${error} - Drone# ${id}`);
  }
};

const randomData = id => {
  return {
    id: id,
    longitude: random.longitude(),
    latitude: random.latitude(),
    altitude: random.altitude(),
    speed: random.speed()
  };
};
