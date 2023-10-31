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
                        "text": encodeURIComponent(json.caption),
                        "linkedText": json.caption ? encodeURIComponent(instaHashTag(json.caption)) : null,
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
            })
            .catch(err => {
                return callback(err);
            });
    }, err => {
        if (err) console.error(err.message);

        fs.writeFile('./json/instagram.json', JSON.stringify(instaJson), 'utf-8', function(err) {
            if (err) throw err;
            console.log('Instagram Saved!');
        });
    });
}
