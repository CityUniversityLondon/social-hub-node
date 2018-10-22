var inst = require('./instagram');
var youtubeAccounts = require('./youtube');
var facebookAccounts = require('./facebook');
var twitter = require('./twitterApi');
var express = require('express');
var cron = require('node-cron');
var fs = require('fs');

var instJs = require('../../json/instagram.json');
var twit = require('../../json/twitter.json');
var all = require('../../json/all.json');


app = express();

cron.schedule('*/1 * * * *', function() {
    Promise.all(youtube.youtubeAccounts).then(r=> {
      fs.writeFile('../../json/youtube.json', JSON.stringify([].concat(...r)) , 'utf-8' , function (err) {
            if (err) throw err;
            console.log('Youtube json Saved!');
          });
    });

});

cron.schedule('*/1 * * * *', function() {
    Promise.all(facebook.facebookAccounts).then(r=> {
      fs.writeFile('../../json/facebook.json', JSON.stringify([].concat(...r)) , 'utf-8' , function (err) {
            if (err) throw err;
            console.log('facebook json Saved!');
          });
    });

});

cron.schedule('*/1 * * * *', function() {
    Promise.all(inst.instAccounts).then(r=> {
      fs.writeFile('../../json/instagram.json', JSON.stringify([].concat(...r)) , 'utf-8' , function (err) {
            if (err) throw err;
            console.log('instagram json Saved!');
          });
    });

});

cron.schedule('*/1 * * * *', function() {
    twitter.getTwitter();

});


cron.schedule('*/1 * * * *', function() {
    var all = [...instJs, ...twit];

    fs.writeFile('../../json/all.json', JSON.stringify(all), 'utf-8', function(err) {
        if (err) throw err;
        console.log('All json Saved!');
    });

});

cron.schedule('*/2 * * * *', function() {
    var s = [].concat(...all);
    s.sort(function(a, b) {
        return new Date(b.timeCreated * 1000) - new Date(a.timeCreated * 1000);
    });

    fs.writeFile('../../json/all.json', JSON.stringify(s), 'utf-8', function(err) {
        if (err) throw err;
        console.log('all json Sorted!');
    });
});



app.listen("3128");