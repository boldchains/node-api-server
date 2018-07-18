const http = require('http')
const socketIo = require('socket.io')

const hostname = process.env.drone1host || '127.0.0.1'
const port = process.env.drone1port || 3011
const id = process.env.drone1id || 1234 // drone id
const freq = process.env.drone1freq || 5000
const minLongitude = process.env.minLongitude || 10
const maxLongitude = process.env.maxLongitude || 20

const info = () => {
  console.log(`Drone# ${id} active at http://${hostname}:${port}/`)
}

server = http.createServer().listen(port, hostname, info)

let interval = null
const io = socketIo(server)

io.on('connection', socket => {
  console.log(`Drone# {id} connected`)
  if(interval) {
    clearInterval(interval)
  }
  interval = setInterval(() => emitGeoLocation(socket), freq)
  socket.on('disconnect', () => console.log('Drone disconnected'))
})

const emitGeoLocation = socket => {
  try {
    data = {longitude: randLongitude(), lattitude: 20, altitude: 10, speed: 100}
    console.log('Geo Location data:', data)
    socket.emit(`from_${id}`, data)
  } catch(error) {
    console.error(`Error: ${error.code} - Drone# ${id}`)
  }
}

const randLongitude = () => {
  let long = (Math.random() * (maxLongitude - minLongitude)) + minLongitude
  let degree = Math.floor(long)
  let minute = (long - degree) * 100
}
