/////////////////////  SERVER  ////////////////////////

const server = require('./server');
const port = process.env.PORT || 4001;
const winston = require('./config/winston');

server.appHttpServer.listen(port, () => {
  winston.info(`Drone server is running on port ${port}`);
});


//////////////////  DRONE SIMULATOR ///////////////////////
const drones = require('./droneParams');
const simulator = require('./simulator/drone');
drones.params.forEach(drone => simulator.simulate(drone));
