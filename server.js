var routes = require('./src/routes');
var express = require('express');
var cron = require('node-cron');
var fs = require('fs');
var bodyParser = require('body-parser');

var inst = require('./src/social-api/instagram');
var youtube = require('./src/social-api/youtube');
var facebook = require('./src/social-api/facebook');
var twitter = require('./src/social-api/twitterApi');
var twSocialCards = require('./src/social-api/socialCardsTwitter');
var ch = require('./src/methods/changeID');
var sendSocialCards = require('./src/methods/cardsSOAP');
var saveJson = require('./src/methods/saveJSON');


var all = JSON.parse(fs.readFileSync('./json/all.json', 'utf8'));


app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routes);

app.listen(3002, () => {
    console.log('App listening on port 3002');
});

cron.schedule('1 9 * * *', function() {
    Promise.all(youtube.youtubeAccounts).then(r => {
        fs.writeFile('./json/youtube.json', JSON.stringify([].concat(...r)), 'utf-8', function(err) {
            if (err) throw err;
            console.log('Youtube json Saved!');
        });
    });

});

cron.schedule('1 9 * * *', function() {
    Promise.all(facebook.facebookAccounts).then(r => {
            fs.writeFile('./json/facebook.json', JSON.stringify([].concat(...r)), 'utf-8', function(err) {
                if (err) throw err;
                console.log('facebook json Saved!');
            });
        })
        .catch((er) => {
            console.log(er);
        });

});

cron.schedule('1 9 * * *', function() {
    Promise.all(inst.instAccounts).then(r => {
        var f = r.filter(o => { return o.code !== 400 });
        fs.writeFile('./json/instagram.json', JSON.stringify([].concat(...f)), 'utf-8', function(err) {
            if (err) throw err;
            console.log('instagram json Saved!');
        });
    });

});

cron.schedule('1 9 * * *', function() {
    twitter.getTwitter();

});

cron.schedule('2 9 * * *', function() {
    saveJson.saveJson().then(r =>
        console.log(r));
});

cron.schedule('3 9 * * *', function() {
    var t = JSON.parse(fs.readFileSync('./json/all.json', 'utf8'));
    var st = t.filter(e => e.type === 'Twitter');

    fs.writeFile('./json/twitterID.json', JSON.stringify(st), 'utf-8', function(err) {
        if (err) throw err;
        console.log('Twitter json with ID created!');
    });

});

cron.schedule('57 9 * * *', function() {
    Promise.all(twSocialCards.socialCards).then(r => {
        fs.writeFile('./json/twitterSocialCards.json', JSON.stringify(r), 'utf-8', function(err) {
            if (err) throw err;
            console.log('Twitter social cards Saved!');
        });
    });

});

cron.schedule('41 11 * * *', function() {
    sendSocialCards.sendSocialCards().then(r =>
        console.log(r));
});