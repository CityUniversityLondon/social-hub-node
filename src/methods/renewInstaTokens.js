const axios = require('axios');
const async = require("async");
const accounts = require('../../accounts/accounts.json');

// Use the GET /refresh_access_token endpoint to refresh unexpired long-lived Instagram 
// User Access tokens. Refreshing a long-lived token makes it valid for 60 days again. 
// Long-lived tokens that have not been refreshed in 60 days will expire.

exports.renewInstaToken = function(){
	const instaAccounts = accounts.accounts.instagram;

	async.forEachOf(instaAccounts, (account, key, callback) => {
		axios.get(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${account.token}`)
		.then( r => {
			let hours = (Number(r.data.expires_in) / 60) / 60;
			let days = hours / 24;
			let rd = Math.ceil(days);
			let textDay = rd === 1 ? ' day' : ' days';

			console.log(account.account + " expires in " + rd + textDay);
		});
	});
}