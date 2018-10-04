var fs = require('fs');
var fetch = require('node-fetch');
var accounts = require('../../accounts/accounts.json');
var calDate = require('./calDate');

let ts = Math.round((new Date()).getTime() / 1000);
let onemonthTS = new Date();
onemonthTS.setMonth(onemonthTS.getMonth() - 1);
onemonthTS = Math.round(onemonthTS.getTime() / 1000);

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

var instAccounts = accounts.accounts.instagram.map(function(a){
	return getData(a).then(function(j){
		return j
	})
})


Promise.all(instAccounts).then(r=> {
	fs.writeFile('instagram.json', JSON.stringify([].concat(...r)) , 'utf-8' , function (err) {
			  if (err) throw err;
			  console.log('Saved!');
			});
});