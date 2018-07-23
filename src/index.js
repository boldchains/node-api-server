/////////////////////  SERVER  ////////////////////////

const server = require('./server')
// const drone1 = require('./simulators/drone1')

const port = process.env.PORT || 4001

server.appHttpServer.listen(port, () => {
  console.log(`Drone server is running on port ${port}`)
})


//////////////////  DRONE SIMULATOR ///////////////////////
const drones = require('./droneParams')
const simulator = require('./simulator/drone')
drones.params.forEach(drone => simulator.simulate(drone))
