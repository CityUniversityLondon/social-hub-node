var routes = require('./src/routes');
var express = require('express');
var cron = require('node-cron');
var fs = require('fs');
var bodyParser = require('body-parser');
/*var memwatch = require('memwatch-next');*/

var inst = require('./src/social-api/insta');
var youtube = require('./src/social-api/yt');
var facebook = require('./src/social-api/fb');
var twitter = require('./src/social-api/twitterApi');
var twSocialCards = require('./src/social-api/socialCardsTwitter');
var twCourseCards = require('./src/social-api/courseCardTwitter');
var sendSocialCards = require('./src/methods/cardsSOAP');
var sendCourseSocialCards = require('./src/methods/cityCourseSOAP');
var saveJson = require('./src/methods/saveJSON');


var all = JSON.parse(fs.readFileSync('./json/all.json', 'utf8'));


app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routes);

app.listen(3000, () => {
    console.log('App listening on port 3000');
});

/*memwatch.on('leak', (info) => {
    console.error('Memory leak detected:\n', info);
    fs.writeFile('./error.txt', JSON.stringify(info), 'utf', function(e) {
        if (err) throw err;
        console.log('error');
    })
});*/

cron.schedule('1 */1 * * *', function() {
    youtube.getYt();
});

cron.schedule('1 */1 * * *', function() {
    facebook.getFacebook();
});

cron.schedule('1 */1 * * *', function() {
    inst.getInsta();
});

cron.schedule('1 */1 * * *', function() {
    twitter.getTwitter();
});

cron.schedule('2 */1 * * *', function() {
    saveJson.saveJson().then(r =>
        console.log(r));
});

cron.schedule('3 */1 * * *', function() {
    var t = JSON.parse(fs.readFileSync('./json/all.json', 'utf8'));
    var st = t.filter(e => e.type === 'Twitter');

    fs.writeFile('./json/twitterID.json', JSON.stringify(st), 'utf-8', function(err) {
        if (err) throw err;
        console.log('Twitter json with ID created!');
    });

});

cron.schedule('4 */1 * * *', function() {
    twSocialCards.socialCards();
});

cron.schedule('5 */1 * * *', function() {
    sendSocialCards.sendSocialCards().then(r =>
        console.log(r));
});

cron.schedule('6 */1 * * *', function() {
    twCourseCards.socialCards();
});

cron.schedule('7 */1 * * *', function() {
    sendCourseSocialCards.sendCityCourse().then(r =>
        console.log(r));
});