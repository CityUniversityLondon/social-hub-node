const date = require('express').Router();
const all = require('./all');
const twitter = require('./twitter');
const instagram = require('./instagram');

date.get('/', all);

date.get('/twitter', twitter);

date.get('/instagram', instagram);

module.exports = date;