var fs = require('fs');
var fetch = require('node-fetch');
var accounts = require('../../accounts/accounts.json');
var calDate = require('../methods/calDate');
var moment = require('moment');

let ts = Math.round((new Date()).getTime() / 1000);
let onemonthTS = new Date();
onemonthTS.setMonth(onemonthTS.getMonth() - 1);
onemonthTS = Math.round(onemonthTS.getTime() / 1000);

const fields = 'id,message,link,name,description,type,created_time,from,object_id,full_picture';

function getData(account) {
    return new Promise(function(resolve, reject) {
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
                        'itemRef': calDate.formatDate(e.created_time),
                        'postId': null,
                        'timeCreated': Math.round((new Date(e.created_time)).getTime() / 1000),
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
    })
}

exports.facebookAccounts = accounts.accounts.facebook.map(function(a) {
    return getData(a).then(function(j) {
        return j
    })
})