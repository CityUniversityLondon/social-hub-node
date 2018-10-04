import accounts from '../../accounts/accounts.json';
import {daysAgo, formatDate} from './calDate';

let ts = Math.round((new Date()).getTime() / 1000);
let onemonthTS = new Date();
onemonthTS.setMonth(onemonthTS.getMonth() - 1);
onemonthTS = Math.round(onemonthTS.getTime() / 1000);
console.log(onemonthTS);
let array = [];
let instagramjson = accounts.accounts.instagram.forEach(e => {
		 fetch(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${e.token}&max_timestamp=${ts}&min_timestamp=${onemonthTS}`)
		  .then(function(response) {

		   return response.json();

		  }).then(j => {
		  	j.data.forEach(e => {
		  		/*let curDate = new Date();
		  		let date = new Date(e.created_time * 1000);
		  		console.log(date);
		  		let year = date.getFullYear();
		  		let month = date.getMonth();
		  		month = month + 1;
		  		let day = date.getDate();
		  		var oneDay = 24*60*60*1000; 
		  		var diffDays = Math.round(Math.abs((date.getTime() - curDate.getTime())/(oneDay)));*/
		  		
		  		let instaFormat = {
		  			"itemRef": formatDate(e.created_time * 1000),
		  			"postId":null,
		  			"timeCreated":e.created_time,
		  			"type":"Instagram",
		  			"fullName":e.user.full_name,
		  			"screenName":e.user.username,
		  			"text":e.caption.text,
		  			"linkedText":e.caption.text,
		  			"accountUrl":"https:\/\/instagram.com\/"+e.user.username,
		  			"timeElapsed":daysAgo(e.created_time * 1000) + ' days ago',
		  			"itemUrl":e.link,
		  			"imageUrl":e.images.standard_resolution.url,
		  			"videoId":null
		  		}
		  		array.push(instaFormat)
		  	});
		  	
		  })
	});


export {array}
	
	










