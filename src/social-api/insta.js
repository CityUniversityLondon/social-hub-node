var fs = require('fs');
var fetch = require('node-fetch');
var express = require('express');
var cron = require('node-cron');
var moment = require('moment');
var async = require("async");
var accounts = require('../../accounts/accounts.json');
var calDate = require('../methods/calDate');

exports.getInsta = function() {

    var instaJson = [];
    let ts = Math.round((new Date()).getTime() / 1000);
    let onemonthTS = new Date();
    onemonthTS.setMonth(onemonthTS.getMonth() - 1);
    onemonthTS = Math.round(onemonthTS.getTime() / 1000);

    async.forEachOf(accounts.accounts.instagram, (account, key, callback) => {
        fetch(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${account.token}&max_timestamp=${ts}&min_timestamp=${onemonthTS}`)
            .then(function(j) {
                return j.json()
            })
            .then(json => {
                if (json.data) {
                    json.data.forEach(function(e) {
                        var a = {
                            "itemRef": calDate.formatDate(e.created_time * 1000),
                            "postId": null,
                            "timeCreated": e.created_time,
                            "type": "Instagram",
                            "fullName": e.user.full_name,
                            "screenName": e.user.username,
                            "text": e.caption.text,
                            "linkedText": e.caption.text.replace(/(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://instagram.com/$2\">@$2</a>'),
                            "accountUrl": "https:\/\/instagram.com\/" + e.user.username,
                            "timeElapsed": moment(e.created_time * 1000).fromNow(),
                            "itemUrl": e.link,
                            "imageUrl": e.images.standard_resolution.url,
                            "videoId": null
                        }
                        instaJson.push(a);
                    });
                    callback();
                } else {
                    //console log instaed of throwing an error as 
                    //it will not carry on fetching
                    console.log(account.account + ' :' + json.meta.error_message);
                    return callback();
                }
            });
    }, err => {
        if (err) console.error(err.message);

        fs.writeFile('./json/instagram.json', JSON.stringify(instaJson), 'utf-8', function(err) {
            if (err) throw err;
            console.log('Instagram Saved!');
        });
    });
}

/*exports.instAccounts = accounts.accounts.instagram.map(function(account) {
    return new Promise(function(resolve, reject) {
        let ts = Math.round((new Date()).getTime() / 1000);
        let onemonthTS = new Date();
        onemonthTS.setMonth(onemonthTS.getMonth() - 1);
        onemonthTS = Math.round(onemonthTS.getTime() / 1000);

        fetch(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${account.token}&max_timestamp=${ts}&min_timestamp=${onemonthTS}`)
            .then(function(j) {
                return j.json()
            })
            .then(json => {
                //Resolve the results even a error is return from the API because Promise all will terminate with one reject
                // Remove the error nodes from the results after promise all
                if (json.data) {
                    var map = json.data.map(function(e) {
                        return {
                            "itemRef": calDate.formatDate(e.created_time * 1000),
                            "postId": null,
                            "timeCreated": e.created_time,
                            "type": "Instagram",
                            "fullName": e.user.full_name,
                            "screenName": e.user.username,
                            "text": e.caption.text,
                            "linkedText": e.caption.text.replace(/(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://instagram.com/$2\">@$2</a>'),
                            "accountUrl": "https:\/\/instagram.com\/" + e.user.username,
                            "timeElapsed": moment(e.created_time * 1000).fromNow(),
                            "itemUrl": e.link,
                            "imageUrl": e.images.standard_resolution.url,
                            "videoId": null
                        }
                    })
                    resolve(map);
                } else {
                    console.log(account.account + ' :' + json.meta.error_message);
                    resolve(json.meta)
                }

            })
    }).then(function(j) {
        return j
    })
})*/