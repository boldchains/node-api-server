const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const axios = require('axios')

const port = process.env.PORT || 4001
const index = require('./routes/index')

//const id = process.env.drone1id || 111 // drone id
const drones = require('./simulate/droneParams')
const socketIOClient = require('socket.io-client')

console.log('Drone Parameters: ', drones.params)
//const drone1_url = 'http://localhost:3111'
//const drone1_socket =socketIOClient(drone1_url)
const droneSockets = []
drones.params.forEach(param => {
  let socket = socketIOClient(`http://${param.hostname}:${param.port}`)
  //let socket = socketIOClient('http://localhost:3111')
  droneSockets.push(socket)
})


const app = express()
app.use(index)

const server = http.createServer(app)
const io = socketIo(server)

const freq = 1000
io.on('connection', socket => {
  console.log('Drone connected');
  setInterval(() => emitDroneDataToClient(socket), freq)
  socket.on('disconnect', () => console.log('Drone disconnected'))
})

console.log('DroneSockets size: ', droneSockets.length)

const emitDroneDataToClient = socket => {
  try {
    droneSockets.forEach((drone, i) => {
      drone.on(`from_${drones.params[i].id}`, data => {
        //let geo = `Geo Location: \n ID: ${data.id} Longitude: ${data.longitude} Latitude: ${data.latitude} Altitude: ${data.altitude}m Speed: ${data.speed}mph`
        //console.log(geo)
        socket.emit('FromAPI', data)
      })
    })

  } catch(error) {
    console.error(`Error: ${error.code}`)
  }
}

server.listen(port, () => console.log(`Listening on port ${port}`))
