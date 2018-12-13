const routes = require('express').Router();
const date = require('./date');

routes.use('/', date);

module.exports = routes;