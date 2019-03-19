var Twitter = require('twitter');
const fs = require('fs');
var moment = require('moment');
var accounts = require('../../accounts/accounts.json');
var calDate = require('./calDate');


exports.twitter = async function(query) {

    let promise = new Promise((resolve, reject) => {
        var client2 = new Twitter({
            consumer_key: accounts.twittercredentials.credential2.consumerKey,
            consumer_secret: accounts.twittercredentials.credential2.consumerSecret,
            access_token_key: accounts.twittercredentials.credential2.accessToken,
            access_token_secret: accounts.twittercredentials.credential2.accessTokenSecret
        });

        var results = client2.get('search/tweets', { q: query, count: 4 }, function(error, tweets, response) {

            resolve(tweets.statuses.map(function(e) {
                var j = null
                if (e.entities.media !== undefined) {
                    j = e.entities.media[0].media_url
                }
                return {
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
                    'profileImage' : e.user.profile_image_url_https,
                    'hashTags': e.entities.hashtags
                }
            }));
        });
    });

    let results = await promise;

    return results;
}