import accounts from '../../accounts/accounts.json';
import {daysAgo, formatDate} from './calDate';

let twomonthTS = new Date();
twomonthTS.setMonth(twomonthTS.getMonth() - 2);
let ytarray = [];

accounts.accounts.youtube.forEach(e=>{
	fetch(`https://www.googleapis.com/youtube/v3/activities?channelId=${e.account}&key=${e.token}&part=snippet,contentDetails&publishedAfter=${twomonthTS.toISOString()}&maxResults=50`)
	.then(r=> { 
		console.log(r)
		return r.json();
	})
	.then(j=> {
		
		j.items.forEach(e=>{
			/*let curDate = new Date();
			let oneDay = 24*60*60*1000;
		  	let date = new Date(e.snippet.publishedAt);
		  	let ts = Math.round((new Date(date)).getTime() / 1000);
			let diffDays = Math.round(Math.abs((date.getTime() - curDate.getTime())/(oneDay)));
			let year = date.getFullYear();
		  	let month = date.getMonth();
		  	month = month + 1;
		  	let day = date.getDate();*/

			let ytdata = {
			'itemRef' : formatDate(e.snippet.publishedAt),
			'postId' : null,
			'timeCreated' : Math.round((new Date()).getTime() / 1000),
			'type' : 'Youtube',
			'fullName' : e.snippet.channelTitle,
			'screenName' : e.snippet.channelTitle,
			'text' : e.snippet.title,
			'linkedText' : e.snippet.title,
			'accountUrl' : 'https:\/\/www.youtube.com\/channel\/' + e.snippet.channelId,
			'timeElapsed' : daysAgo(e.snippet.publishedAt) + ' days ago',
			'itemUrl' : e.contentDetails.upload.videoId,
			'imageUrl' : e.snippet.thumbnails.default.url,
			'videoId' : e.contentDetails.upload.videoId
			}

			ytarray.push(ytdata);
		});
	});
});

export {ytarray}