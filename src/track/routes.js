// const express = require('express')
// const router = express.Router()
const express = require('express')
const validate = require('isvalid')
const errors = require('express-simple-errors')

/*
// though the server is not intended to serve any HTML content,
// a simple route is needed to listen for any incoming connection
router.get('/', (req, res) => {
  res.send({ response: 'Server is alive' }).status(200)
})

module.exports = router
*/

//export default function() {
module.exports = function() {
  const router = express.Router()

  router.route('/')
    .get(returnResponse)

  function returnResponse(req, res) {
    res.json({ response: 'Server is alive' }).status(200)
  }

  return router
}
