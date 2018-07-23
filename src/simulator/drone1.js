const http = require('http')
const socketIo = require ('socket.io')
const random = require('./randomize')

let id = 111
let hostname = '127.0.0.1'
let port = 3111
let freq = 1000

let server = http.createServer().listen(port, hostname, () => {
  console.log(`Drone# ${id} active at http://${hostname}:${port}/`)
})
let io = socketIo(server)
let interval = null
io.on('connection', socket => {
  console.log(`Drone# ${id} connected`)
  if(interval) {
    clearInterval(interval)
  }
  interval = setInterval(() => emitGeoLocation(socket), freq)
  socket.on('disconnect', () => console.log('Drone disconnected'))
})

const emitGeoLocation = (socket) => {
  try {
    socket.emit(`from_${id}`, randomData(id))
  } catch(error) {
    console.error(`Error: ${error} - Drone# ${id}`)
  }
}

const randomData = id => {
  return {
    id: id,
    longitude: random.longitude(),
    latitude: random.latitude(),
    altitude: random.altitude(),
    speed: random.speed()
  }
}
