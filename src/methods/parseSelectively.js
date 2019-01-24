const bfj = require('bfj');
const fs = require('fs');

async function loadJson (){
	let promise = new Promise((resolve, reject) => {

		let a = [];
		let dataStream = bfj.match(fs.createReadStream('./json/all.json'), (key, value) => {
			return key < 20
		});

		dataStream.on('data', value => {
		  a.push(value);
		});

		dataStream.on('end', value => {
		  resolve(a);
		});
	});

	let results = await promise;

    return results
}

async function loadJsonId (id){
	let promise = new Promise((resolve, reject) =>{
		let a = [];
		let k = null;
		let dataStream = bfj.match(fs.createReadStream('./json/all.json'), (key, value) => {
			
			if (value.itemRef === id){
				k = key;
				return value
			}
			else if (k !== null){
				if(key < k+20){
					return value
				}
			}
		});

		dataStream.on('data',  value => {
		  a.push(value);
		});

		dataStream.on('end', value => {
		  resolve(a);
		});
	});
	let results = await promise;

    return results
}


module.exports = {
	loadJson: loadJson,
	loadJsonId: loadJsonId
}
