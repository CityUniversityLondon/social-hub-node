var fs = require('fs');
var fetch = require('node-fetch');
var accounts = require('../../accounts/accounts.json');
var calDate = require('./calDate');
var express = require('express');
var cron = require('node-cron');

app = express();

let ts = Math.round((new Date()).getTime() / 1000);
let onemonthTS = new Date();
onemonthTS.setMonth(onemonthTS.getMonth() - 1);
onemonthTS = Math.round(onemonthTS.getTime() / 1000);


//Using the account detail pass in as a parameter return a new promise to fetch the social api
//then return the data in the correct format
function getData(account) {
    return new Promise(function(resolve, reject){
    	fetch(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${account.token}&max_timestamp=${ts}&min_timestamp=${onemonthTS}`)
    	.then(function (j){
    		return j.json()
    	})
    	.then(json => {
    		var map = json.data.map(function(e){
    			return{
			  			"itemRef": calDate.formatDate(e.created_time * 1000),
			  			"postId":null,
			  			"timeCreated":e.created_time,
			  			"type":"Instagram",
			  			"fullName":e.user.full_name,
			  			"screenName":e.user.username,
			  			"text":e.caption.text,
			  			"linkedText":e.caption.text,
			  			"accountUrl":"https:\/\/instagram.com\/"+e.user.username,
			  			"timeElapsed":calDate.daysAgo(e.created_time * 1000) + ' days ago',
			  			"itemUrl":e.link,
			  			"imageUrl":e.images.standard_resolution.url,
			  			"videoId":null
			  		}
    		})
    		resolve(map);
    	})
    })
}


//Using the map func to retieve accounts info to call getData function which is a promise
exports.instAccounts = accounts.accounts.instagram.map(function(a){
	return getData(a).then(function(j){
		return j
	})
})

//Promise all return all json object as resolve once all resolve write them to disk 


