const date = require('express').Router();
const all = require('./all');
const id = require('./date');

date.get('/', all);

date.get('/:Id', id);

module.exports = date;