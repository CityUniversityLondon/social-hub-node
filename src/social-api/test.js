var inst = require('./instagram');
var twitter = require('./twitterApi');
var youtube = require('./youtube');
var facebook = require('./facebook');
var express = require('express');
var cron = require('node-cron');
var fs = require('fs');
var ch = require('../methods/changeID');

var instJs = require('../../json/instagram.json');
var twit = require('../../json/twitter.json');
var yt = require('../../json/youtube.json');
var fb =require('../../json/facebook.json');
var all = require('../../json/all.json');

 
const app = express();



cron.schedule('8 15 * * *', function() {
    var all = [...instJs, ...twit, ...yt, ...fb];

    fs.writeFile('../../json/all.json', JSON.stringify(all), 'utf-8', function(err) {
        if (err) throw err;
        console.log('All json Saved!');
    });

});

cron.schedule('11 15 * * *', function() {
    var s = [].concat(...all);
    s.sort(function(a, b) {
        return new Date(b.timeCreated * 1000) - new Date(a.timeCreated * 1000);
    });

    fs.writeFile('../../json/all.json', JSON.stringify(s), 'utf-8', function(err) {
        if (err) throw err;
        console.log('json Sorted!');
    });
});

cron.schedule('14 15 * * *', function() {
   ch.changeId();
   console.log('ID changed');
});

// Turn on that server!
app.listen(3000, () => {
  console.log('App listening on port 3000');
});