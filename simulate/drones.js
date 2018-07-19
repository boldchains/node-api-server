const http = require('http')
const socketIo = require('socket.io')

//const minLongitude = process.env.minLongitude || 10
//const maxLongitude = process.env.maxLongitude || 30
const longitude = {
  min: process.env.minLongitude || 10,
  max: process.env.maxLongitude || 30  // this is to test 'Active'/'Inactive' status
}
//const minLatitude = process.env.minLatitude || 50
//const maxLatitude = process.env.maxLatitude || 80
const latitude = {
  min: process.env.minLatitude || 50,
  max: process.env.maxLatitude || 80  // this is to test 'Active'/'Inactive' status
}
//const minAltitude = process.env.minAltitude || 15
//const maxAltitude = process.env.maxAltitude || 35
const altitude = {
  min: process.env.minAltitude || 15,
  max: process.env.maxAltitude || 35  // this is to test 'Active'/'Inactive' status
}
//const minSpeed = process.env.minSpeed || 0
//const maxSpeed = process.env.maxSpeed || 125
const speed = {
  min: process.env.minSpeed || 0,
  max: process.env.maxSpeed || 125  // this is to test 'Active'/'Inactive' status
}
//const minFrequency = process.env || 1000
//const maxFrequency = process.env || 15000  // this is to test 'Active'/'Inactive' status
const freq = {
  min: process.env.minFreq || 5000,
  max: process.env.maxFreq || 20000  // this is to test 'Active'/'Inactive' status
}

const drones = require('./droneParams')

const droneSimulators = []
drones.params.forEach( (eachDrone, i) => {
  let server = http.createServer().listen(drones.params[i].port, drones.params[i].hostname, () => {
    console.log(`Drone# ${drones.params[i].id} active at http://${drones.params[i].hostname}:${drones.params[i].port}/`)
  })
  let io = socketIo(server)
  droneSimulators.push(io)
})

let intervals = [null, null]

droneSimulators.forEach((io, i) => {
  io.on('connection', socket => {
    console.log(`Drone# ${drones.params[i].id} connected`)
    if(intervals[i]) {
      clearInterval(intervals[i])
    }
    intervals[i] = setInterval(() => emitGeoLocation(socket, i), drones.params[i].freq)
    //let randFreq = random(freq) // random frequency is set, so as to test 'Active'/'Inactive' status
    //console.log(`For ${drones.params[i]}, randFreq is ${randFreq}`)
    //intervals[i] = setInterval(() => emitGeoLocation(socket, i), randFreq)
    socket.on('disconnect', () => console.log('Drone disconnected'))
  })
})

const emitGeoLocation = (socket, i) => {
  try {
    data = {
      id: drones.params[i].id,
      //longitude: randLongitude(),
      longitude: 100,
      latitude: randLatitude(),
      altitude: random(altitude),
      speed: random(speed)
    }
    console.log('Geo Location data:', data)
    socket.emit(`from_${drones.params[i].id}`, data)
  } catch(error) {
    console.error(`Error: ${error} - Drone# ${drones.params[i].id}`)
  }
}

const randLongitude = () => {
  //let rand = (Math.random() * (maxLongitude - minLongitude)) + minLongitude
  //let degree = Math.floor(rand)
  let degree = random(longitude)
  let minute = Math.floor(Math.random() * 100)
  let second = (Math.random() * 10).toFixed(2)
  let direction = degree % 2 ? 'E' : 'W'
  return degree+String.fromCharCode(176)+' '+
          minute+"' "+
          second+'" '+
          direction
}

const randLatitude = () => {
  //let rand = (Math.random() * (maxLatitude - minLatitude)) + minLatitude
  //let degree = Math.floor(rand)
  let degree = random(latitude)
  let minute = Math.floor(Math.random() * 100)
  let second = (Math.random() * 10).toFixed(2)
  let direction = degree % 2 ? 'N' : 'S'
  return degree+String.fromCharCode(176)+' '+
          minute+"' "+
          second+'" '+
          direction
}
/*
const randAltitude = () => {
  // let rand = (Math.random() * (maxAltitude - minAltitude)) + minAltitude
  //return Math.floor(rand)
  return randomizeUsing(minAltitude, maxAltitude)
}

const randSpeed = () => {
  //let rand = (Math.random() * (maxSpeed - minSpeed)) + minSpeed
  //return Math.floor(rand)
  return randomizeUsing(minSpeed, maxSpeed)
}

const randFreq = () => {
  return randomizeUsing(minFrequency, maxFrequency)
}

const randomizeUsing = (min, max) => {
  let rand = (Math.random() * (max - min)) + min
  return Math.floor(rand)
}
*/

const random = param => {
  let rand = (Math.random() * (param.max - param.min)) + param.min
  return Math.floor(rand)
}
