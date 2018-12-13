var fs = require('fs');
var inst = require('./instagram');

Promise.all(inst.instAccounts)
	.catch(e => {
		console.log(e);
		return inst.instAccounts
	})
	.then(r=> {
		var f = r.filter(o=>{ return o.code !== 400})
      fs.writeFile('../../json/instagram.json', JSON.stringify([].concat(...f)) , 'utf-8' , function (err) {
            if (err) throw err;
            console.log('instagram json Saved!');
          });
    });