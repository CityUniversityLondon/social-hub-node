//var inst = require('./instagram');
//var twitter = require('./twitterApi');
//var youtube = require('./youtube');
//var facebook = require('./facebook');
var express = require('express');
//var cron = require('node-cron');
var fs = require('fs');

var instJs = require('../../json/instagram.json');
var twit = require('../../json/twitter.json');
var yt = require('../../json/youtube.json');
var fb =require('../../json/facebook.json');
var all = require('../../json/all.json');

 
const app = express();
const routes = require('../routes');
 
app.use('/', routes);

// Turn on that server!
app.listen(3000, () => {
  console.log('App listening on port 3000');
});