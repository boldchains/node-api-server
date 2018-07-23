//const express = require('express')
//const http = require('http')
//const socketIo = require('socket.io')
//const axios = require('axios')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
//const errorHandler = require('express-simple-errors')
const http = require('http')
const socketIo = require('socket.io')
const axios = require('axios')

const routes = require('./track/routes')

const port = process.env.PORT || 4001
//const index = require('./routes/index')

//////////////////// SIMULATED DRONES: CLIENT SETUP //////////////////////
///////////////////  DRONES DATA RECEIVER ////////////////////////////////
const socketIOClient = require('socket.io-client')
const drones = require('./droneParams')

console.log('Drone Parameters: ', drones.params)

const droneSockets = []
drones.params.forEach(param => {
  let socket = socketIOClient(`http://${param.hostname}:${param.port}`)
  droneSockets.push(socket)
})


///////////////////////  DRONE SERVER SETUP //////////////////////////
const app = express()
//app.use(index)

// app middleware
app.use(cors())
app.use(bodyParser.json({type: 'application/json'}))
app.disable('etag')

app.use('/', routes())

//const errorHandler = new ErrorHandler()

// validation errors are not typed correctly - changing here
app.use((err, req, res, next) => {
  if(err.validator) {
    err.name = 'ValidationError'
    err.code = 400
  }
  next(err)
})

/*
errorHandler.setHandler('ValidationError', (err, stack) => {
  const res = {}
  res.status = 'Error'
  res.message = `Validation Error: ${err.message}`
  res.code = err.code
  if(stack) res.stackTrace = err.stack
  return res
})

app.use(errorHandler.middleware())  */

const appHttpServer = http.createServer(app)
const io = socketIo(appHttpServer)

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
        //let dataS = updateDroneStatus(data)
        //socket.emit('FromAPI', dataS)
        data['status'] = 'Active'
        socket.emit('FromAPI', data)
      })
    })
  } catch(error) {
    console.error(`Error: ${error.code}`)
  }
}

/*
const permittedInactiveTime = 10 // in seconds

const updateDroneStatus = data => {
  let prev = prevDroneData[data.id]
  let tNow = timeNow()
  let diff = prev ? tNow - prev.ts : 0
  if(prev && data.id === 333) console.log(`ID 333 diff is ${diff} = prevTs ${prev.ts} - ${tNow}`)
  let inactive = diff > permittedInactiveTime
  data['status'] = prev && inactive ? 'Inactive' : 'Active'
  data['ts'] = tNow
  prevDroneData[data.id] = data
  return data
}

const timeNow = () => { // Answers in seconds
  return Math.floor(Date.now() / 1000)
}
*/

//appHttpServer.listen(port, () => console.log(`Listening on port ${port}`))
module.exports = {
  appHttpServer: appHttpServer
}
