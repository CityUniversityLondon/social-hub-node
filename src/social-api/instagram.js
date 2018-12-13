var fs = require('fs');
var fetch = require('node-fetch');
var accounts = require('../../accounts/accounts.json');
var calDate = require('../methods/calDate');
var express = require('express');
var cron = require('node-cron');
var moment = require('moment');

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
    		//Resolve the results even a error is return from the API because Promise all will terminate with one reject
    		// Remove the error nodes from the results after promise all
    		if(json.data){
    			var map = json.data.map(function(e){
	    			return{
				  			"itemRef": calDate.formatDate(e.created_time * 1000),
				  			"postId":null,
				  			"timeCreated":e.created_time,
				  			"type":"Instagram",
				  			"fullName":e.user.full_name,
				  			"screenName":e.user.username,
				  			"text":e.caption.text,
				  			"linkedText":e.caption.text.replace(/(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://instagram.com/$2\">@$2</a>'),
				  			"accountUrl":"https:\/\/instagram.com\/"+e.user.username,
				  			"timeElapsed":moment(e.created_time * 1000).fromNow(),
				  			"itemUrl":e.link,
				  			"imageUrl":e.images.standard_resolution.url,
				  			"videoId":null
				  		}
	    		})
	    		resolve(map);
    		}
    		else{
    			console.log(account.account + ' :' + json.meta.error_message);
    			resolve(json.meta)
    		}
    		
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


