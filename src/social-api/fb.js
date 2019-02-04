var fs = require('fs');
var fetch = require('node-fetch');
var moment = require('moment');
var async = require("async");
var accounts = require('../../accounts/accounts.json');
var calDate = require('../methods/calDate');

exports.getFacebook = function() {
    let ts = Math.round((new Date()).getTime() / 1000);
    let onemonthTS = new Date();
    onemonthTS.setMonth(onemonthTS.getMonth() - 1);
    onemonthTS = Math.round(onemonthTS.getTime() / 1000);

    const fields = 'id,message,link,name,description,type,created_time,from,object_id,full_picture';

    var jsonFb = [];

    async.forEachOf(accounts.accounts.facebook, (account, key, callback) => {
        fetch(`https://graph.facebook.com/${account.account}/posts?access_token=${account.token}&fields=${fields}&limit=10&since=${onemonthTS}&date_format=U`)
            .then(function(j) {
                return j.json()
            })
            .then(function(json) {
                if (json.error) {
                    throw new Error(json.error.message);
                }
                json.data.forEach(e => {
                    let postsId = e.id.replace(e.from.id + '_', '');
                    var text = null;
                    if (e.message) {
                        text = e.message;
                    } else if (e.description) {
                        text = e.description
                    }
                    var a = {
                        'itemRef': moment(e.created_time, 'X').format('YYYYMMDD'),
                        'postId': null,
                        'timeCreated': e.created_time,
                        'type': 'Facebook',
                        'fullName': e.from.name,
                        'screenName': account.accountname,
                        'text': text,
                        'linkedText': text,
                        'accountUrl': 'http:\/\/www.facebook.com\/' + account.account,
                        'timeElapsed': moment(e.created_time * 1000).fromNow(),
                        'itemUrl': 'https://www.facebook.com/' + e.from.id + '/posts/' + postsId,
                        'imageUrl': e.full_picture,
                        'videoId': null
                    }
                    jsonFb.push(a);
                });

                callback();
            });
    }, err => {
        if (err) console.error(err.message);
        fs.writeFile('./json/facebook.json', JSON.stringify(jsonFb), 'utf-8', function(err) {
            if (err) throw err;
            console.log('Facebook Saved!');
        });
    })
}


/*exports.facebookAccounts = accounts.accounts.facebook.map(function(account) {
    let ts = Math.round((new Date()).getTime() / 1000);
    let onemonthTS = new Date();
    onemonthTS.setMonth(onemonthTS.getMonth() - 1);
    onemonthTS = Math.round(onemonthTS.getTime() / 1000);

    const fields = 'id,message,link,name,description,type,created_time,from,object_id,full_picture';

    return new Promise((resolve, reject) => {
        fetch(`https://graph.facebook.com/${account.account}/posts?access_token=${account.token}&fields=${fields}&limit=10&since=${onemonthTS}&date_format=U`)
            .then(function(j) {
                return j.json()
            })
            .then(json => {
                if (json.error) {
                    return reject(new Error(json.error.message))
                }

                var map = json.data.map(function(e) {
                    let postsId = e.id.replace(e.from.id + '_', '');
                    var text = null;
                    if (e.message) {
                        text = e.message;
                    } else if (e.description) {
                        text = e.description
                    }
                    return {
                        'itemRef': moment(e.created_time, 'X').format('YYYYMMDD'),
                        'postId': null,
                        'timeCreated': e.created_time,
                        'type': 'Facebook',
                        'fullName': e.from.name,
                        'screenName': account.accountname,
                        'text': text,
                        'linkedText': text,
                        'accountUrl': 'http:\/\/www.facebook.com\/' + account.account,
                        'timeElapsed': moment(e.created_time * 1000).fromNow(),
                        'itemUrl': 'https://www.facebook.com/' + e.from.id + '/posts/' + postsId,
                        'imageUrl': e.full_picture,
                        'videoId': null
                    }
                })
                resolve(map);

            })
            .catch((er) => {
                return reject(new Error(er))
            })
    }).then(r => {
        return r;
    })
})*/