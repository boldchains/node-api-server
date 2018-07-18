const express = require('express')
const router = express.Router()


// though the server is not intended to serve any HTML content,
// a simple route is needed to listen for any incoming connection
router.get('/', (req, res) => {
  res.send({ response: 'Server is alive' }).status(200)
})

module.exports = router
