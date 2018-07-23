const express = require('express')
const validate = require('isvalid')
const errors = require('express-simple-errors')

const returnResponse = (req, res) => {
  res.json({ response: 'Server is alive' }).status(200)
}

module.exports = () => {
  const router = express.Router()
  router.route('/').get(returnResponse)
  return router
}
