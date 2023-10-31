var fs = require('fs');

async function saveJson() {
    let promise = new Promise((resolve, reject) => {
        var instJs = JSON.parse(fs.readFileSync('./json/instagram.json', 'utf8'));
        var yt = JSON.parse(fs.readFileSync('./json/youtube.json', 'utf8'));
        var fb = JSON.parse(fs.readFileSync('./json/facebook.json', 'utf8'));
        var a = [...instJs, ...yt, ...fb];

        /*Sort the json object by the date*/

        a.sort(function(a, b) {
            return new Date(b.timeCreated * 1000) - new Date(a.timeCreated * 1000);
        });

        /*Change itemRef to be unique*/

        var counter = 0;
        var newArray = [];
        a.reduce(function(prev, next, index) {
            if (prev.itemRef === next.itemRef) {
                var obj = prev;
                obj.itemRef = obj.itemRef + '-' + counter;
                newArray.push(obj);
                counter++;
            } else {
                counter = 0;
                newArray.push(prev);
            }

            return next
        });

        /*Save the JSON object to disk*/

        fs.writeFile('./json/all.json', JSON.stringify(a), 'utf-8', function(err) {
            if (err) throw err;
            console.log('All json Saved!');
            resolve('done');
        });
    });

    let results = await promise;

    return results
}

module.exports.saveJson = saveJson;