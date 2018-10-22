var inst = require('../../json/instagram.json');
var fs = require('fs');

Promise.all(inst).then(r => {
    var s = [].concat(...r);
    s.sort(function(a,b){
        return new Date(b.timeCreated*1000) - new Date(a.timeCreated*1000);
    });

    fs.writeFile('../../json/instagram.json', JSON.stringify(s) , 'utf-8' , function (err) {
                  if (err) throw err;
                  console.log('Instagram json Saved!');
                });
})