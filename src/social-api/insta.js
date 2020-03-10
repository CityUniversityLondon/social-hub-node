var fs = require('fs');
var fetch = require('node-fetch');
var express = require('express');
var cron = require('node-cron');
var moment = require('moment');
var async = require("async");
const axios = require('axios');
var accounts = require('../../accounts/accounts.json');
let instagramMedia = require('../../accounts/instagramMedia.json')
var calDate = require('../methods/calDate');
var {instaHashTag} = require('../methods/textFormat');
/*test*/
exports.getInsta = function() {

    var instaJson = [];
    let ts = Math.round((new Date()).getTime() / 1000);
    let onemonthTS = new Date();
    onemonthTS.setMonth(onemonthTS.getMonth() - 1);
    onemonthTS = Math.round(onemonthTS.getTime() / 1000);

    async.forEachOf(instagramMedia, (account, key, callback) => {
            axios.get(`https://graph.instagram.com/${account.id}/?access_token=${account.token}&fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username`)
            .then(function(j){return j.data;})
            .then(function(json){
                if(json){
                    let media = {
                        "itemRef": calDate.formatDate(json.timestamp),
                        "postId": json.id,
                        "timeCreated": Math.round((new Date(json.timestamp)).getTime() / 1000),
                        "type": "Instagram",
                        "fullName": json.username,
                        "screenName": json.username,
                        "text": json.caption,
                        "linkedText": json.caption ? instaHashTag(json.caption) : null,
                        "accountUrl": "https:\/\/instagram.com\/" + json.username,
                        "timeElapsed": moment(json.timestamp).fromNow(),
                        "itemUrl": json.permalink,
                        "imageUrl": json.thumbnail_url ? json.thumbnail_url : json.media_url,
                        "videoId": null
                    }
                    instaJson.push(media);
                    callback();
                }
                else{
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

    fetch(`https://graph.instagram.com/${account.token}/?access_token=${account.token}&fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username`)
            .then(function(j) {
                return j.json()
            })
            .then(json => {
                if (json.data) {
                    json.data.forEach(function(e) {
                        let txt = e.caption && e.caption.text;
                        var a = {
                            "itemRef": calDate.formatDate(e.created_time * 1000),
                            "postId": null,
                            "timeCreated": e.created_time,
                            "type": "Instagram",
                            "fullName": e.user.full_name,
                            "screenName": e.user.username,
                            "text": txt,
                            "linkedText": txt ? instaHashTag(txt) : null,
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
})*/