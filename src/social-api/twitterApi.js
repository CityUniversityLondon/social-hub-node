var Twitter = require('twitter');
var fs = require('fs');
var moment = require('moment');
var async = require("async");
var accounts = require('../../accounts/accounts.json');
var calDate = require('../methods/calDate');


var client = new Twitter({
    consumer_key: accounts.twittercredentials.credential1.consumerKey,
    consumer_secret: accounts.twittercredentials.credential1.consumerSecret,
    access_token_key: accounts.twittercredentials.credential1.accessToken,
    access_token_secret: accounts.twittercredentials.credential1.accessTokenSecret
});

var client2 = new Twitter({
    consumer_key: accounts.twittercredentials.credential2.consumerKey,
    consumer_secret: accounts.twittercredentials.credential2.consumerSecret,
    access_token_key: accounts.twittercredentials.credential2.accessToken,
    access_token_secret: accounts.twittercredentials.credential2.accessTokenSecret
});



exports.getTwitter = function() {
    var jsonTwitter = [];

    async.forEachOf(accounts.accounts.twitter, (value, key, callback) => {

        if (value.credential === 1) {
            var params = { screen_name: value.account, count: 10 };
            client.get('statuses/user_timeline', params, function(error, tweets, response) {
                if (!error) {

                    tweets.forEach(e => {
                        var j = null
                        if (e.entities.media !== undefined) {
                            j = e.entities.media[0].media_url
                        }
                        //console.log(j);

                        var getT = {
                            'itemRef': calDate.formatDate(e.created_at),
                            'postId': e.id,
                            'timeCreated': Math.round((new Date(e.created_at)).getTime() / 1000),
                            'type': 'Twitter',
                            'fullName': e.user.name,
                            'screenName': e.user.screen_name,
                            'text': e.text,
                            'linkedText': e.text.replace(/(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/hashtag/$2?src=hash\">#$2</a>').replace(/(^|\B)@(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/$2\">@$2</a>'),
                            'accountUrl': 'http:\/\/twitter.com\/' + e.user.screen_name,
                            'timeElapsed': moment(new Date(e.created_at)).fromNow(),
                            'itemUrl': 'https://twitter.com/' + e.user.screen_name + '/status/' + e.id_str,
                            'imageUrl': j,
                            'videoId': null,
                            'hashTags': e.entities.hashtags
                        }
                        jsonTwitter.push(getT);

                    });
                }
                callback();
            });
        } else {
            var params = { screen_name: value.account, count: 10 };
            client2.get('statuses/user_timeline', params, function(error, tweets, response) {
                if (!error) {

                    tweets.forEach(e => {

                        var j = null
                        if (e.entities.media !== undefined) {
                            j = e.entities.media[0].media_url
                        }

                        var getT = {
                            'itemRef': calDate.formatDate(e.created_at),
                            'postId': e.id,
                            'timeCreated': Math.round((new Date(e.created_at)).getTime() / 1000),
                            'type': 'Twitter',
                            'fullName': e.user.name,
                            'screenName': e.user.screen_name,
                            'text': e.text,
                            'linkedText': e.text.replace(/(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/hashtag/$2?src=hash\">#$2</a>').replace(/(^|\B)@(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/$2\">@$2</a>'),
                            'accountUrl': 'http:\/\/twitter.com\/' + e.user.screen_name,
                            'timeElapsed': moment(new Date(e.created_at)).fromNow(),
                            'itemUrl': 'https://twitter.com/' + e.user.screen_name + '/status/' + e.id_str,
                            'imageUrl': j,
                            'videoId': null,
                            'hashTags': e.entities.hashtags
                        }
                        jsonTwitter.push(getT);

                    });
                }
                callback();
            });
        }




    }, err => {
        if (err) console.error(err.message);
        // configs is now a map of JSON data
        fs.writeFile('./json/twitter.json', JSON.stringify(jsonTwitter), 'utf-8', function(err) {
            if (err) throw err;
            console.log('Twitter Saved!');
        });
    });
}