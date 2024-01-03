var fs = require('fs');
const axios = require('axios');
var async = require("async");
var accounts = require('../../accounts/accounts.json');

exports.getInstaMediaID = function(){
	let insta = [];

	async.forEachOf(accounts.accounts.instagram, (account, key, callback) =>{
		axios.get(`https://graph.instagram.com/${account.id}/media?access_token=${account.token}&fields=id,media_count,username,account_type`)
		.then(function(r) { return r.data; })
		.then( json => {
			if (json.data) {
				json.data.forEach(function (m){
					let mediaList = {
						"account": account.account,
						"token": account.token,
						"id": m.id,
						"username": m.username
					};
					insta.push(mediaList); 
				});
				
				callback();
			}
			else{
				console.log('then block' + account.account + ' :' + json.error);
                    return callback();
			}
		})
		.catch(err => {
			console.log(err);
			return callback();
		});
	}, err => {
        if (err) console.error('Err block' + err.message);

        fs.writeFile('./accounts/instagramMedia.json', JSON.stringify(insta), 'utf-8', function(err) {
            if (err) throw err;
            console.log('Instagram Media Saved!');
        });
    });
}