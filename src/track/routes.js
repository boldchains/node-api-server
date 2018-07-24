const express = require('express');

const returnResponse = (req, res) => {
  res.json({ response: 'Server is alive' }).status(200);
};

module.exports = () => {
  const router = express.Router();
  router.route('/').get(returnResponse);
  return router;
};
