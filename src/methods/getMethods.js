var fs = require('fs');


exports.getJson = async function() {
    /*var all = JSON.parse(fs.readFileSync('./json/all.json', 'utf8'));
    return all.slice(0, 20);*/

    var promise = new Promise((resolve, reject) => {
        var c = fs.readFile('./json/all.json', 'utf8', function(e, content) {
            resolve(JSON.parse(content).slice(0, 20));
        });
    });

    let results = await promise;

    return results
}

exports.getJsonById = async function(id) {
    /*var al = JSON.parse(fs.readFileSync('./json/all.json', 'utf8'));
    var index = al.findIndex((e) => {
        return e.itemRef === id
    });

    if (index === -1) {
        console.log(index);
        return al.slice(0, 20)
    } else {
        console.log(index);
        var e = index + 20;

        return al.slice(index, e)
    }*/
    var promise = new Promise((resolve, reject) => {
        var c = fs.readFile('./json/all.json', 'utf8', function(e, content) {
            let json = JSON.parse(content);
            var index = json.findIndex((e) => {
                return e.itemRef === id
            });

            if (index === -1) {
                console.log(index);
                resolve(json.slice(0, 20));
            } else {
                console.log(index);
                var e = index + 20;

                resolve(json.slice(index, e));
            }
        });
    });

    let results = await promise;

    return results

}

exports.getTwitter = async function() {
    /*var tw = JSON.parse(fs.readFileSync('./json/twitterID.json', 'utf8'));
    return tw.slice(0, 20);*/

    var promise = new Promise((resolve, reject) => {
        var c = fs.readFile('./json/twitterID.json', 'utf8', function(e, content) {
            resolve(JSON.parse(content).slice(0, 20));
        });
    });

    var results = await promise;

    return results;
}

exports.getTwitterSN = async function(sName) {
    /*var t = JSON.parse(fs.readFileSync('./json/twitterID.json', 'utf8'));
    var sn = t.filter(e => e.screenName === sName);

    return sn.slice(0, 20);*/

    var promise = new Promise((resolve, reject) => {
        var t = fs.readFile('./json/twitterID.json', 'utf8', function(e, content) {
            var pj = JSON.parse(content);
            var f = pj.filter(e => e.screenName === sName);
            resolve(f.slice(0, 20));
        });
    });

    var results = await promise;

    return results;
}

exports.getTwitterHT = function(hashTag) {
    var t = JSON.parse(fs.readFileSync('./json/twitterID.json', 'utf8'));
    let n = t.filter(e => {
        if (e.hashTags.find(t => t.text === hashTag)) {
            return e;
        }
        return
    });

    return n;
}

exports.getInstagram = async function() {
    /*var tw = JSON.parse(fs.readFileSync('./json/twitterID.json', 'utf8'));
    return tw.slice(0, 20);*/

    var promise = new Promise((resolve, reject) => {
        var instagramJson = fs.readFile('./json/instagramID.json', 'utf8', function(e, content) {
            resolve(JSON.parse(content).slice(0, 20));
        });
    });

    var results = await promise;

    return results;
}

exports.getInstagramSN = async function(sName) {
    /*var t = JSON.parse(fs.readFileSync('./json/twitterID.json', 'utf8'));
    var sn = t.filter(e => e.screenName === sName);

    return sn.slice(0, 20);*/

    var promise = new Promise((resolve, reject) => {
        var instagram = fs.readFile('./json/instagramID.json', 'utf8', function(e, content) {
            var pj = JSON.parse(content);
            var f = pj.filter(e => e.screenName === sName);
            resolve(f.slice(0, 20));
        });
    });

    var results = await promise;

    return results;
}

exports.getFacebook = async function() {

    var promise = new Promise((resolve, reject) => {
        let facebookJson = fs.readFile('./json/facebookID.json', 'utf8', function(e, content) {
            resolve(JSON.parse(content).slice(0, 20));
        });
    });

    var results = await promise;

    return results;
}

exports.getFacebookSN = async function(sName) {

    let promise = new Promise((resolve, reject) => {
        let facebook = fs.readFile('./json/facebookID.json', 'utf8', function(e, content) {
            let pj = JSON.parse(content);
            let f = pj.filter(e => e.screenName === sName);
            resolve(f.slice(0, 20));
        });
    });

    let results = await promise;

    return results;
}