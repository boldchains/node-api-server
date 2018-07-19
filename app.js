const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const axios = require('axios')

const port = process.env.PORT || 4001
const index = require('./routes/index')

const drones = require('./simulate/droneParams')
const socketIOClient = require('socket.io-client')

console.log('Drone Parameters: ', drones.params)

const droneSockets = []
drones.params.forEach(param => {
  let socket = socketIOClient(`http://${param.hostname}:${param.port}`)
  droneSockets.push(socket)
})

const app = express()
app.use(index)

const server = http.createServer(app)
const io = socketIo(server)

const freq = 1000
io.on('connection', socket => {
  console.log('Drone connected')
  setInterval(() => emitDroneDataToClient(socket), freq)
  socket.on('disconnect', () => console.log('Drone disconnected'))
})

const prevDroneData = {} // track drone TimeStamp to update its 'active' status
                    // if seen within 10 seconds from last timestamp else
                    // status is marked as 'Inactive', and it enables the client-side
                    // to highlight such inactive drones
const emitDroneDataToClient = socket => {
  try {
    droneSockets.forEach((drone, i) => {
      drone.on(`from_${drones.params[i].id}`, data => {
        let dataS = updateDroneStatus(data)
        socket.emit('FromAPI', dataS)
      })
    })
  } catch(error) {
    console.error(`Error: ${error.code}`)
  }
}

const permittedInactiveTime = 10 // in seconds

const updateDroneStatus = data => {
  let prev = prevDroneData[data.id]
  if(prev) {
    if(isInactive(prev, data)) {
      data['status'] = 'Inactive'
      console.log(`Inactive ${data.id}`)
    } else {
      data['status'] = 'Active'
      prevDroneData[data.id] = data
      //console.log(`Active ${data.id}`)
    }
  } else {
    data['status'] = 'Active'
    prevDroneData[data.id] = data
    console.log(`Added into prevDroneData array ${data.id}`)
  }
  data['ts'] = timeNow()
  return data
}

const isInactive = (prev, current) => {
  let tNow = timeNow()
  let diff = tNow - prev.ts
  console.log(`id ${current.id} prev longitude ${prev.longitude} - current longitude ${current.longitude} - diff ${diff} - tNow ${tNow} - prevTs ${prev.ts}`)
  return prev.longitude === current.longitude &&
          //prev.latitude === current.latitude &&
          //prev.altitude === current.altitude &&
          //prev.speed === current.speed &&
          diff > permittedInactiveTime
}

/*
const updateDroneStatus = (drone, data) => {
  let ts = dronesTS.find(each => each.id === drone.id)
  if(!ts) { // no drone found, then add one now
    ts = {
      drone: drone,
      lastSeenAt: timeNow()
    }
    dronesTS.push(ts)
    data['status'] = 'Active'
    console.log('app >> updateDroneStatus(...)  new timestamp added')
  } else { // do status update based on last seen time stamp
    let tNow = timeNow()
    let diff = tNow - ts.lastSeenAt
    console.log(`timeNow: ${tNow}, last seen ${ts.lastSeenAt}, diff: ${diff}`)
    //data['status'] = diff > permittedInactiveTime ? 'Inactive' : 'Active'
    //if(data['status'] === 'Inactive') {
    if(diff > permittedInactiveTime && noNewData(ts.drone, data)){
      data['status'] = 'Inactive'
      console.log(`Drone ${drone.id} is Inactive..............`)
    } else {
      ts.lastSeenAt = tNow
      data['status'] = 'Active'
    }
    //dronesTS = dronesTS.filter(each => each.id !== drone.id) // remove inactive drone from TS list
  }
  return data;
}
*/

const timeNow = () => { // Answers in seconds
  return Math.floor(Date.now() / 1000)
}

//const noNewData = (tsDrone, currentData)


server.listen(port, () => console.log(`Listening on port ${port}`))
