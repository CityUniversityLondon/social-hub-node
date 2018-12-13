var fs = require('fs');
var fetch = require('node-fetch');
var accounts = require('../../accounts/accounts.json');
var calDate = require('../methods/calDate');
var moment = require('moment');

let twomonthTS = new Date();
twomonthTS.setMonth(twomonthTS.getMonth() - 2);

function getData(account) {
    return new Promise(function(resolve, reject){
    	fetch(`https://www.googleapis.com/youtube/v3/activities?channelId=${account.account}&key=${account.token}&part=snippet,contentDetails&publishedAfter=${twomonthTS.toISOString()}&maxResults=50`)
    	.then(function (j){
    		return j.json()
    	})
    	.then(json => {
    		var map = json.items.map(function(e){
    			return{
			  			'itemRef' : calDate.formatDate(e.snippet.publishedAt),
						'postId' : null,
						'timeCreated' : Math.round((new Date(e.snippet.publishedAt)).getTime() / 1000),
						'type' : 'Youtube',
						'fullName' : e.snippet.channelTitle,
						'screenName' : e.snippet.channelTitle,
						'text' : e.snippet.title,
						'linkedText' : e.snippet.title,
						'accountUrl' : 'https:\/\/www.youtube.com\/channel\/' + e.snippet.channelId,
						'timeElapsed' : moment(e.snippet.publishedAt).fromNow(),
						'itemUrl' : e.contentDetails.upload.videoId,
						'imageUrl' : e.snippet.thumbnails.default.url,
						'videoId' : e.contentDetails.upload.videoId
			  		}
    		})
    		resolve(map);
    	})
    })
}

exports.youtubeAccounts = accounts.accounts.youtube.map(function(a){
	return getData(a).then(function(j){
		return j
	})
})

/*Promise.all(youtubeAccounts).then(r=> {
	fs.writeFile('../../json/youtube.json', JSON.stringify([].concat(...r)) , 'utf-8' , function (err) {
			  if (err) throw err;
			  console.log('Saved!');
			});
});*/