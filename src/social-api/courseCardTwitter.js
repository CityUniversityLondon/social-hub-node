var Twitter = require('twitter');
var fs = require('fs');
var async = require("async");
var moment = require('moment');
var accounts = require('../../accounts/accounts.json');
var calDate = require('../methods/calDate');
var {twitterTextFormatter} = require('../methods/textFormat');

var client = new Twitter({
    consumer_key: accounts.twittercredentials.credential1.consumerKey,
    consumer_secret: accounts.twittercredentials.credential1.consumerSecret,
    access_token_key: accounts.twittercredentials.credential1.accessToken,
    access_token_secret: accounts.twittercredentials.credential1.accessTokenSecret
});


exports.socialCards = function() {
    var json = [];

    async.forEachOf(accounts.accounts.twitterCourseCards, (a, key, callback) => {
        var params = { screen_name: a.account, count: 1, result_type: 'recent', include_rts: false };

        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if(tweets[0]){
                var j = tweets[0] && tweets[0].entities && tweets[0].entities.media && tweets[0].entities.media[0].media_url;;
                // if (tweets[0].entities.media !== undefined) {
                //     j = tweets[0].entities.media[0].media_url
                // }
                var t = {
                    'itemRef': 'tw-' + tweets[0].user.screen_name,
                    'postId': tweets[0].id,
                    'timeCreated': Math.round((new Date(tweets[0].created_at)).getTime() / 1000),
                    'type': 'Twitter',
                    'fullName': tweets[0].user.name,
                    'screenName': tweets[0].user.screen_name,
                    'text': encodeURI(tweets[0].text),
                    'linkedText': encodeURI(twitterTextFormatter(tweets[0].text)),
                    'accountUrl': 'http:\/\/twitter.com\/' + tweets[0].user.screen_name,
                    'timeElapsed': moment(new Date(tweets[0].created_at)).fromNow(),
                    'itemUrl': 'https://twitter.com/' + tweets[0].user.screen_name + '/status/' + tweets[0].id_str,
                    'imageUrl': j,
                    'videoId': null
                }
                json.push(t);
            }
            else{
                console.log('No tweets we are excluding retweets - ' + a.account);
            }
            callback();
        });
    }, err => {
        if (err) console.log(err.message);
        fs.writeFile('./json/twitterCourseCards.json', JSON.stringify(json), 'utf-8', function(err) {
            if (err) throw err;
            console.log('Twitter course cards Saved!');
        });
    });
}