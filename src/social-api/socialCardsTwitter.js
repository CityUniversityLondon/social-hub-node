var Twitter = require('twitter');
var fs = require('fs');
var async = require("async");
var moment = require('moment');
var accounts = require('../../accounts/accounts.json');
var calDate = require('../methods/calDate');


/*var client2 = new Twitter({
    consumer_key: accounts.twittercredentials.credential2.consumerKey,
    consumer_secret: accounts.twittercredentials.credential2.consumerSecret,
    access_token_key: accounts.twittercredentials.credential2.accessToken,
    access_token_secret: accounts.twittercredentials.credential2.accessTokenSecret
});

var jsonTwitter = [];

exports.getTwitterSocialCards = function() {
    
    async.forEachOf(accounts.accounts.twitterSocialCards, (value, key, callback) => {
        var params = { screen_name: value.account, count: 10 };
        client2.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (error) return callback(error);
            try {
                var j = null;
                if (tweets[0].entities.media !== undefined) {
                    j = tweets[0].entities.media[0].media_url
                }

                var getT = {
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
                }

                jsonTwitter.push(getT);

            } catch (e) {
                return callback(e)
            }
            callback();
        });
    }, err => {
        if (err) console.error(err.message);
        fs.writeFile('./json/twitter.json', JSON.stringify(jsonTwitter) , 'utf-8' , function (err) {
				  if (err) throw err;
				  console.log('Twitter Saved!');
				});
    });
}*/

var client2 = new Twitter({
    consumer_key: accounts.twittercredentials.credential2.consumerKey,
    consumer_secret: accounts.twittercredentials.credential2.consumerSecret,
    access_token_key: accounts.twittercredentials.credential2.accessToken,
    access_token_secret: accounts.twittercredentials.credential2.accessTokenSecret
});

function getTwitter(a){
	return new Promise(function(resolve, reject){
		var params = { screen_name: a.account, count: 1 };

		client2.get('statuses/user_timeline', params, function(error, tweets, response){
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
                'linkedText': escape(tweets[0].text.replace(/(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/hashtag/$2?src=hash\">#$2</a>').replace(/(^|\B)@(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/$2\">@$2</a>')),
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
	return getTwitter(a).then(j=> {
		return j
	})
})