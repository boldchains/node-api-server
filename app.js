const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const axios = require('axios')

const port = process.env.PORT || 4001
const index = require('./routes/index')

const id = process.env.drone1id || 1234 // drone id

const app = express()
app.use(index)

const server = http.createServer(app)
const io = socketIo(server)

const freq = 1000
io.on('connection', socket => {
  console.log('Drone connected');
  setInterval(() => getApiAndEmit(socket), freq)
  socket.on('disconnect', () => console.log('Drone disconnected'))
})

const socketIOClient = require('socket.io-client')
const drone1_url = 'http://localhost:3011'
const drone1_socket =socketIOClient(drone1_url)

const getApiAndEmit = socket => {
  try {
    drone1_socket.on(`from_${id}`, data => {
      //let longStr = toStr(data.longitude)
      //let latStr = toStr(data.latitude)
      let geo = `Geo Location: \n ID: ${data.id} Longitude: ${data.longitude} Latitude: ${data.latitude} Altitude: ${data.altitude}m Speed: ${data.speed}mph`
      socket.emit('FromAPI', geo)
    })
  } catch(error) {
    console.error(`Error: ${error.code}`)
  }
}
/*
const toStr = (data) => {
  // console.log('app.js >> toStr(data) ', data)
  if(!data) return ''
  return data.degree+String.fromCharCode(176)+' '+
          data.minute+"' "+
          data.second+'" '+
          data.direction
} */
server.listen(port, () => console.log(`Listening on port ${port}`))
