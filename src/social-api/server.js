var inst = require('./instagram');
var youtube = require('./youtube');

var twitter = require('./twitterApi');

var routes = require('../routes');
var express = require('express');
var cron = require('node-cron');
var fs = require('fs');
var bodyParser = require('body-parser'); 

//Change from require to fs.readFileSync because require cache the file
var instJs = JSON.parse(fs.readFileSync('../../json/instagram.json', 'utf8'));
var twit = JSON.parse(fs.readFileSync('../../json/twitter.json', 'utf8'));
var yt = JSON.parse(fs.readFileSync('../../json/youtube.json', 'utf8'));
var fb = JSON.parse(fs.readFileSync('../../json/facebook.json', 'utf8'));
var all = JSON.parse(fs.readFileSync('../../json/all.json', 'utf8'));

var twSocialCards = require('./socialCardsTwitter');


app = express();
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());
app.use('/', routes);

cron.schedule('2 15 * * *', function() {
    Promise.all(youtube.youtubeAccounts).then(r=> {
      fs.writeFile('../../json/youtube.json', JSON.stringify([].concat(...r)) , 'utf-8' , function (err) {
            if (err) throw err;
            console.log('Youtube json Saved!');
          });
    });

});



cron.schedule('2 15 * * *', function() {
    Promise.all(inst.instAccounts).then(r=> {
      fs.writeFile('../../json/instagram.json', JSON.stringify([].concat(...r)) , 'utf-8' , function (err) {
            if (err) throw err;
            console.log('instagram json Saved!');
          });
    });

});

cron.schedule('2 15 * * *', function() {
    twitter.getTwitter();

});


cron.schedule('3 15 * * *', function() {
    var all = [...instJs, ...twit, ...yt, ...fb];

    fs.writeFile('../../json/all.json', JSON.stringify(all), 'utf-8', function(err) {
        if (err) throw err;
        console.log('All json Saved!');
    });

});

cron.schedule('4 15 * * *', function() {
    var s = [].concat(...all);
    s.sort(function(a, b) {
        return new Date(b.timeCreated * 1000) - new Date(a.timeCreated * 1000);
    });

    fs.writeFile('../../json/all.json', JSON.stringify(s), 'utf-8', function(err) {
        if (err) throw err;
        console.log('json Sorted!');
    });
});

cron.schedule('36 10 * * *', function() {
    var t = twit;
    t.sort(function(a, b) {
        return new Date(b.timeCreated * 1000) - new Date(a.timeCreated * 1000);
    });

    fs.writeFile('../../json/twitter.json', JSON.stringify(s), 'utf-8', function(err) {
        if (err) throw err;
        console.log('twitter json Sorted!');
    });
});


cron.schedule('40 15 * * *', function() {
    Promise.all(twSocialCards.socialCards).then(r => {
         fs.writeFile('../../json/twitter.json', JSON.stringify(r) , 'utf-8' , function (err) {
                  if (err) throw err;
                  console.log('Twitter Saved!');
                });
    });

});



app.listen(3002, () => {
    console.log('App listening on port 3002');
});

