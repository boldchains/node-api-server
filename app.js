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
  //let drone1_url = 'https://api.darksky.net/forecast/13a7df2d0e3e159a27b406c349f2bc0d/43.7695,11.2558'
  try {
    //const res = await axios.get(drone1_url)
    //socket.emit('FromAPI', res.data.currently.temperature)
    //socket.emit('FromAPI', res.data)
    drone1_socket.on(`from_${id}`, data => {
      let geo = `Geo Location: ${data.longitude}`
      socket.emit('FromAPI', geo)
    })
  } catch(error) {
    console.error(`Error: ${error.code}`)
  }
}

server.listen(port, () => console.log(`Listening on port ${port}`))
