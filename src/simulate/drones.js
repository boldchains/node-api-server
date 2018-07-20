import http from 'http'
import socketIo from 'socket.io'
// const http = require('http')
//const socketIo = require('socket.io')

//import { drones.params } from './droneParams'
/*
const droneParams = [{
  id: 111,
  hostname: '127.0.0.1',
  port: 3111,
  freq: 1000
}, {
  id: 222,
  hostname: '127.0.0.1',
  port: 3222,
  freq: 2000
}, {
  id: 333,
  hostname: '127.0.0.1',
  port: 3333,
  freq: 20000
}];
*/

const longitude = {
  min: process.env.minLongitude || 10,
  max: process.env.maxLongitude || 30  // this is to test 'Active'/'Inactive' status
}
const latitude = {
  min: process.env.minLatitude || 50,
  max: process.env.maxLatitude || 80  // this is to test 'Active'/'Inactive' status
}
const altitude = {
  min: process.env.minAltitude || 15,
  max: process.env.maxAltitude || 35  // this is to test 'Active'/'Inactive' status
}
const speed = {
  min: process.env.minSpeed || 0,
  max: process.env.maxSpeed || 125  // this is to test 'Active'/'Inactive' status
}
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
    socket.on('disconnect', () => console.log('Drone disconnected'))
  })
})

const emitGeoLocation = (socket, i) => {
  try {
    let id = drones.params[i].id
    socket.emit(`from_${drones.params[i].id}`, randomData(id))
  } catch(error) {
    console.error(`Error: ${error} - Drone# ${drones.params[i].id}`)
  }
}

const randomData = id => {
  return {
    id: id,
    longitude: randLongitude(),
    latitude: randLatitude(),
    altitude: random(altitude),
    speed: random(speed)
  }
}

const randLongitude = () => {
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
  let degree = random(latitude)
  let minute = Math.floor(Math.random() * 100)
  let second = (Math.random() * 10).toFixed(2)
  let direction = degree % 2 ? 'N' : 'S'
  return degree+String.fromCharCode(176)+' '+
          minute+"' "+
          second+'" '+
          direction
}

const random = param => {
  let rand = (Math.random() * (param.max - param.min)) + param.min
  return Math.floor(rand)
}
