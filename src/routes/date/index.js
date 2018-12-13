const date = require('express').Router();
const all = require('./all');
const id = require('./date');
const twitter = require('./twitter');

date.get('/', all);

date.get('/twitter', twitter);

module.exports = date;