var fs = require('fs');
var fetch = require('node-fetch');
var moment = require('moment');
var async = require("async");
var accounts = require('../../accounts/accounts.json');
var calDate = require('../methods/calDate');

exports.getYt = function() {
    var ytJson = [];
    let twomonthTS = new Date();
    twomonthTS.setMonth(twomonthTS.getMonth() - 2);

    async.forEachOf(accounts.accounts.youtube, (account, key, callback) => {
        fetch(`https://www.googleapis.com/youtube/v3/activities?channelId=${account.account}&key=${account.token}&part=snippet,contentDetails&publishedAfter=${twomonthTS.toISOString()}&maxResults=50`)
            .then(function(j) {
                return j.json()
            })
            .then(json => {
                json.items.forEach(function(e) {
                    var a = {
                        'itemRef': calDate.formatDate(e.snippet.publishedAt),
                        'postId': null,
                        'timeCreated': Math.round((new Date(e.snippet.publishedAt)).getTime() / 1000),
                        'type': 'Youtube',
                        'fullName': e.snippet.channelTitle,
                        'screenName': e.snippet.channelTitle,
                        'text': e.snippet.title,
                        'linkedText': e.snippet.title,
                        'accountUrl': 'https:\/\/www.youtube.com\/channel\/' + e.snippet.channelId,
                        'timeElapsed': moment(e.snippet.publishedAt).fromNow(),
                        'itemUrl': e.contentDetails.upload.videoId,
                        'imageUrl': e.snippet.thumbnails.default.url,
                        'videoId': e.contentDetails.upload.videoId
                    }
                    ytJson.push(a);
                });
                callback();
            })
            .catch(err => {
                throw new Error(err);
            });
    }, err => {
        if (err) console.error(err.message);

        fs.writeFile('./json/youtube.json', JSON.stringify(ytJson), 'utf-8', function(err) {
            if (err) throw err;
            console.log('Youtube Saved!');
        });
    });

}

/*exports.youtubeAccounts = accounts.accounts.youtube.map(function(account) {
    let twomonthTS = new Date();
    twomonthTS.setMonth(twomonthTS.getMonth() - 2);

    return new Promise((resolve, reject) => {
        fetch(`https://www.googleapis.com/youtube/v3/activities?channelId=${account.account}&key=${account.token}&part=snippet,contentDetails&publishedAfter=${twomonthTS.toISOString()}&maxResults=50`)
            .then(function(j) {
                return j.json()
            })
            .then(json => {
                var map = json.items.map(function(e) {
                    return {
                        'itemRef': calDate.formatDate(e.snippet.publishedAt),
                        'postId': null,
                        'timeCreated': Math.round((new Date(e.snippet.publishedAt)).getTime() / 1000),
                        'type': 'Youtube',
                        'fullName': e.snippet.channelTitle,
                        'screenName': e.snippet.channelTitle,
                        'text': e.snippet.title,
                        'linkedText': e.snippet.title,
                        'accountUrl': 'https:\/\/www.youtube.com\/channel\/' + e.snippet.channelId,
                        'timeElapsed': moment(e.snippet.publishedAt).fromNow(),
                        'itemUrl': e.contentDetails.upload.videoId,
                        'imageUrl': e.snippet.thumbnails.default.url,
                        'videoId': e.contentDetails.upload.videoId
                    }
                })
                resolve(map);
            })
    }).then(r => r)
})*/