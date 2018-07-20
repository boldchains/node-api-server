//const express = require('express')
//const http = require('http')
//const socketIo = require('socket.io')
//const axios = require('axios')

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import ErrorHandler from 'express-simple-errors'
import http from 'http'
import socketIo from 'socket.io'
import axios from 'axios'
import socketIOClient from 'socket.io-client'

import routes from './track/routes'

//const port = process.env.PORT || 4001
//const index = require('./routes/index')

const drones = require('./simulate/droneParams')
//import { droneParams } from './simulate/droneParams'
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

//const socketIOClient = require('socket.io-client')

console.log('Drone Parameters: ', drones.params)

const droneSockets = []
drones.params.forEach(param => {
  let socket = socketIOClient(`http://${param.hostname}:${param.port}`)
  droneSockets.push(socket)
})

const app = express()
//app.use(index)

// app middleware
app.use(cors())
app.use(bodyParser.json({type: 'application/json'}))
app.disable('etag')

app.use('/', routes())

const errorHandler = new ErrorHandler()

// validation errors are not typed correctly - changing here
app.use((err, req, res, next) => {
  if(err.validator) {
    err.name = 'ValidationError'
    err.code = 400
  }
  next(err)
})

errorHandler.setHandler('ValidationError', (err, stack) => {
  const res = {}
  res.status = 'Error'
  res.message = `Validation Error: ${err.message}`
  res.code = err.code
  if(stack) res.stackTrace = err.stack
  return res
})

app.use(errorHandler.middleware())

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

//server.listen(port, () => console.log(`Listening on port ${port}`))
export default appHttpServer
