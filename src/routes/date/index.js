const date = require('express').Router();
const all = require('./all');
const twitter = require('./twitter');
const instagram = require('./instagram');
const facebook = require('./facebook');

date.get('/', all);

date.get('/twitter', twitter);

date.get('/instagram', instagram);

date.get('/facebook', facebook);

module.exports = date;