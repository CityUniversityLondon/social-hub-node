const fs = require('fs');

async function test(){
	var promise = new Promise((resolve, reject) => {
		var c = fs.readFile('../../json/all.json', 'utf8', function(e, content){
			resolve(content);
		});
	});

	let results = await promise;

	return results
}

test().then(r => console.log(r));