var Twitter = require('twitter');
var fs = require('fs');
var async = require("async");
var moment = require('moment');
var async = require("async");
var accounts = require('../../accounts/accounts.json');
var calDate = require('../methods/calDate');
var {twitterTextFormatter} = require('../methods/textFormat');

var client2 = new Twitter({
    consumer_key: accounts.twittercredentials.credential2.consumerKey,
    consumer_secret: accounts.twittercredentials.credential2.consumerSecret,
    access_token_key: accounts.twittercredentials.credential2.accessToken,
    access_token_secret: accounts.twittercredentials.credential2.accessTokenSecret
});

/*function getTwitter(a) {
    return new Promise(function(resolve, reject) {
        var params = { screen_name: a.account, count: 1, result_type: 'recent' };

        client2.get('statuses/user_timeline', params, function(error, tweets, response) {
            var j = null;
            if (tweets[0].entities.media !== undefined) {
                j = tweets[0].entities.media[0].media_url
            }
            resolve({
                'itemRef': 'tw-' + tweets[0].user.screen_name,
                'postId': tweets[0].id,
                'timeCreated': Math.round((new Date(tweets[0].created_at)).getTime() / 1000),
                'type': 'Twitter',
                'fullName': tweets[0].user.name,
                'screenName': tweets[0].user.screen_name,
                'text': tweets[0].text,
                'linkedText': tweets[0].text,
                'accountUrl': 'http:\/\/twitter.com\/' + tweets[0].user.screen_name,
                'timeElapsed': moment(new Date(tweets[0].created_at)).fromNow(),
                'itemUrl': 'https://twitter.com/' + tweets[0].user.screen_name + '/status/' + tweets[0].id_str,
                'imageUrl': j,
                'videoId': null
            });
        })
    })
}

exports.socialCards = accounts.accounts.twitterSocialCards.map(a => {
    return getTwitter(a).then(j => {
        return j
    })
})*/

exports.socialCards = function() {
    var json = [];

    async.forEachOf(accounts.accounts.twitterSocialCards, (a, key, callback) => {
        var params = { screen_name: a.account, count: 1, result_type: 'recent', include_rts: false };

        client2.get('statuses/user_timeline', params, function(error, tweets, response) {
            
            if(tweets[0]){
                var j = tweets[0] && tweets[0].entities && tweets[0].entities.media && tweets[0].entities.media[0].media_url;
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
                'imageUrl': null,
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
        fs.writeFile('./json/twitterSocialCards.json', JSON.stringify(json), 'utf-8', function(err) {
            if (err) throw err;
            console.log('Twitter social cards Saved!');
        });
    });
}