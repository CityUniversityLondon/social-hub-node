import accounts from '../../accounts/accounts.json';
import {daysAgo, formatDate} from './calDate';

let ts = Math.round((new Date()).getTime() / 1000);
let fbarray = [];
const fields = 'id,message,link,name,description,type,created_time,from,object_id,full_picture';
let onemonthTS = new Date();
onemonthTS.setMonth(onemonthTS.getMonth() - 1);
onemonthTS = Math.round(onemonthTS.getTime() / 1000);

accounts.accounts.facebook.forEach(e=>{
	fetch(`https://graph.facebook.com/${e.account}/posts?access_token=${e.token}&fields=${fields}&limit=10&since=${onemonthTS}`)
	.then(r=> {
		return r.json();
	})
	.then(r=>{
		let results = {
			'results' : r,
			'token' : e.token,
			'account' : e.accountname
		}

		return results;
	})
	.then(j=>{
		
		
		j.results.data.forEach(e=> {
			/*let curDate = new Date();
			let oneDay = 24*60*60*1000; 
			let date = new Date(e.created_time);
			let ts = Math.round((new Date(date)).getTime() / 1000);
			let diffDays = Math.round(Math.abs((date.getTime() - curDate.getTime())/(oneDay)));
			let year = date.getFullYear();
		  	let month = date.getMonth();
		  	month = month + 1;
		  	let day = date.getDate();*/
			
			let postsId = e.id.replace(e.from.id+'_' , '');
			let fbdata = {
			'itemRef' : formatDate(e.created_time),
			'postId' : null,
			'timeCreated' : ts,
			'type' : 'Facebook',
			'fullName' : e.from.name,
			'screenName' : j.account,
			'text' : e.name,
			'linkedText' : e.name,
			'accountUrl' : '"http:\/\/www.facebook.com\/' + j.account,
			'timeElapsed' : daysAgo(e.created_time) + ' days ago',
			'itemUrl' : 'https://www.facebook.com/'+e.from.id+'/posts/'+postsId,
			'imageUrl' : e.full_picture,
			'videoId' : null
		}

		fbarray.push(fbdata);
		});
		
	});
});

export {fbarray}