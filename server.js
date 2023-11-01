var routes = require('./src/routes');
var express = require('express');
var cron = require('node-cron');
var fs = require('fs');
var bodyParser = require('body-parser');
const { exec } = require('child_process');
/*var memwatch = require('memwatch-next');*/

var instMedia = require('./src/social-api/instaGetMediaID');
var inst = require('./src/social-api/insta');
var youtube = require('./src/social-api/yt');
var facebook = require('./src/social-api/fb');
var sendSocialCards = require('./src/methods/cardsSOAP');
const rrenewInstaToken = require('./src/methods/renewInstaTokens');
var sendCourseSocialCards = require('./src/methods/cityCourseSOAP');
var saveJson = require('./src/methods/saveJSON');


const restartCommand = "pm2 restart 0";
const listCommand = "pm2 list";

function listApps() {
    exec(listCommand, (err, stdout, stderr) => {
      // handle err if you like!
      console.log(`pm2 list`);
      console.log(`${stdout}`);
    });
  }

const restartApp = function () {
    exec(restartCommand, (err, stdout, stderr) => {
      if (!err && !stderr) {
        console.log(new Date(), `App restarted!!!`);
        listApps();
      }
      else if (err || stderr) {
        console.log(new Date(), `Error in executing ${restartCommand}`, err || stderr);
      }
    });
  }

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

//renew instagram tokens
cron.schedule('0 0 * * *', function() {
    rrenewInstaToken.renewInstaToken();
});

//generate instagram media json
cron.schedule('30 */1 * * *', function() {
    instMedia.getInstaMediaID();
});

cron.schedule('1 */1 * * *', function() {
    youtube.getYt();
});

cron.schedule('1 */1 * * *', function() {
    facebook.getFacebook();
});

cron.schedule('1 */1 * * *', function() {
    inst.getInsta();
});

cron.schedule('2 */1 * * *', function() {
    saveJson.saveJson().then(r =>
        console.log(r));
});

cron.schedule('3 */1 * * *', function() {
    const t = JSON.parse(fs.readFileSync('./json/all.json', 'utf8'));
    const si = t.filter(e => e.type === 'Instagram');
    const sf = t.filter(e => e.type === 'Facebook');

    fs.writeFile('./json/instagramID.json', JSON.stringify(si), 'utf-8', function(err) {
        if (err) throw err;
        console.log('Instagram json with ID created!');
    });

    fs.writeFile('./json/facebookID.json', JSON.stringify(sf), 'utf-8', function(err) {
        if (err) throw err;
        console.log('facebook json with ID created!');
    });
});

cron.schedule('4 */1 * * *', function() {
    sendSocialCards.sendSocialCards().then(r =>
        console.log(r));
});

cron.schedule('5 */1 * * *', function() {
    sendCourseSocialCards.sendCityCourse().then(r =>
        console.log(r));
});

cron.schedule('15 0 * * 1', function(){
    console.log('Restarting Social hub every Monday');
    restartApp();
});
