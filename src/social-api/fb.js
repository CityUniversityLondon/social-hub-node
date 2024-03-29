var fs = require('fs');
var fetch = require('node-fetch');
var moment = require('moment');
var async = require("async");
var accounts = require('../../accounts/accounts.json');
var calDate = require('../methods/calDate');
var { facebookTextFormatter } = require('../methods/textFormat');

exports.getFacebook = function() {
    let ts = Math.round((new Date()).getTime() / 1000);
    let onemonthTS = new Date();
    onemonthTS.setMonth(onemonthTS.getMonth() - 1);
    onemonthTS = Math.round(onemonthTS.getTime() / 1000);

    const fields = 'id,message,created_time,from,full_picture';

    var jsonFb = [];

    async.forEachOf(accounts.accounts.facebook, (account, key, callback) => {
        fetch(`https://graph.facebook.com/${account.account}/posts?access_token=${account.token}&fields=${fields}&limit=10&since=${onemonthTS}&date_format=U`)
            .then(function(j) {
                return j.json()
            })
            .then(function(json) {
                if (json.error) {
                    console.log(account.account + ': ' + json.error.message);
                }
                else{
                    json.data.forEach(e => {
                        let postsId = e.id.replace(e.from.id + '_', '');
                        var text = null;
                        if (e.message) {
                            text = e.message;
                        }
                        var a = {
                            'itemRef': moment(e.created_time, 'X').format('YYYYMMDD'),
                            'postId': null,
                            'timeCreated': e.created_time,
                            'type': 'Facebook',
                            'fullName': e.from.name,
                            'screenName': account.accountname,
                            'text': text,
                            'linkedText': text, //leave un encode because of old social hub is using this Encode once in web2020
                            'accountUrl': 'http:\/\/www.facebook.com\/' + account.account,
                            'timeElapsed': moment(e.created_time * 1000).fromNow(),
                            'itemUrl': 'https://www.facebook.com/' + e.from.id + '/posts/' + postsId,
                            'imageUrl': e.full_picture,
                            'videoId': null
                        }
                        jsonFb.push(a);
                    });
                }

                callback();
            })
            .catch(err => {
                return callback(err);
            });
    }, err => {
        if (err) console.error(err.message);
        fs.writeFile('./json/facebook.json', JSON.stringify(jsonFb), 'utf-8', function(err) {
            if (err) throw err;
            console.log('Facebook Saved!');
        });
    })
}
