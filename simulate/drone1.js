const http = require('http')
const socketIo = require('socket.io')

const hostname = process.env.drone1host || '127.0.0.1'
const port = process.env.drone1port || 3011
const id = process.env.drone1id || 1234 // drone id
const freq = process.env.drone1freq || 5000
const minLongitude = process.env.minLongitude || 10
const maxLongitude = process.env.maxLongitude || 30
const minLatitude = process.env.minLatitude || 50
const maxLatitude = process.env.maxLatitude || 80
const minAltitude = process.env.minAltitude || 15
const maxAltitude = process.env.maxAltitude || 35
const minSpeed = process.env.minSpeed || 0
const maxSpeed = process.env.maxSpeed || 125

server = http.createServer().listen(port, hostname, () => {
  console.log(`Drone# ${id} active at http://${hostname}:${port}/`)
})

let interval = null
const io = socketIo(server)

io.on('connection', socket => {
  console.log(`Drone# ${id} connected`)
  if(interval) {
    clearInterval(interval)
  }
  interval = setInterval(() => emitGeoLocation(socket), freq)
  socket.on('disconnect', () => console.log('Drone disconnected'))
})

const emitGeoLocation = socket => {
  try {
    data = {
      longitude: randLongitude(),
      latitude: randLatitude(),
      altitude: randAltitude(),
      speed: randSpeed()
    }
    console.log('Geo Location data:', data)
    socket.emit(`from_${id}`, data)
  } catch(error) {
    console.error(`Error: ${error} - Drone# ${id}`)
  }
}

const randLongitude = () => {
  let rand = (Math.random() * (maxLongitude - minLongitude)) + minLongitude
  let degree = Math.floor(rand)
  let minute = Math.floor(Math.random() * 100)
  let second = (Math.random() * 10).toFixed(2)
  let direction = degree % 2 ? 'E' : 'W'
  return {degree: degree, minute: minute, second: second, direction: direction}
}

const randLatitude = () => {
  let rand = (Math.random() * (maxLatitude - minLatitude)) + minLatitude
  let degree = Math.floor(rand)
  let minute = Math.floor(Math.random() * 100)
  let second = (Math.random() * 10).toFixed(2)
  let direction = degree % 2 ? 'N' : 'S'
  return {degree: degree, minute: minute, second: second, direction: direction}
}

const randAltitude = () => {
  let rand = (Math.random() * (maxAltitude - minAltitude)) + minAltitude
  return Math.floor(rand)
}

const randSpeed = () => {
  let rand = (Math.random() * (maxSpeed - minSpeed)) + minSpeed
  return Math.floor(rand)
}
