const date = require('express').Router();
const all = require('./all');
const twitter = require('./twitter');

date.get('/', all);

date.get('/twitter', twitter);

module.exports = date;