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

let dronesTS = [] // track drone TimeStamp to update its 'active' status
                    // if seen within 10 seconds from last timestamp else
                    // status is marked as 'Inactive', and it enables the client-side
                    // to highlight such inactive drones
const emitDroneDataToClient = socket => {
  try {
    droneSockets.forEach((drone, i) => {
      drone.on(`from_${drones.params[i].id}`, data => {
        let dataS = updateDroneStatus(drone, data)
        socket.emit('FromAPI', dataS)
      })
    })
  } catch(error) {
    console.error(`Error: ${error.code}`)
  }
}

const updateDroneStatus = (drone, data) => {
  let ts = dronesTS.find(each => each.id === drone.id)
  if(!ts) { // no drone found, then add one now
    ts = {
      id: drone.id,
      lastSeenAt: timeNow()
    }
    dronesTS.push(ts)
    data['status'] = 'Active'
  } else { // do status update based on last seen time stamp
    let diff = timeNow() - ts.lastSeenAt
    data['status'] = diff > 10 ? 'Inactive' : 'Active'
    dronesTS = dronesTS.filter(each => each.id !== drone.id) // remove inactive drone from TS list
  }
  return data;
}
const timeNow = () => { // Answers in seconds
  return Math.floor(Date.now() / 1000)
}

server.listen(port, () => console.log(`Listening on port ${port}`))
