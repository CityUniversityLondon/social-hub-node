const routes = require('express').Router();
const date = require('./date');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.use('/date', date);

module.exports = routes;