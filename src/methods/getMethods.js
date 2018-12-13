var fs = require('fs');


exports.getJson = function() {
    var all = JSON.parse(fs.readFileSync('./json/all.json', 'utf8'));
    return all.slice(0, 20);
}

exports.getJsonById = function(id) {
    var al = JSON.parse(fs.readFileSync('./json/all.json', 'utf8'));
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
    }
}

exports.getTwitter = function() {
    var tw = JSON.parse(fs.readFileSync('./json/twitterID.json', 'utf8'));
    return tw.slice(0, 20);
}

exports.getTwitterSN = function(sName) {
    var t = JSON.parse(fs.readFileSync('./json/twitterID.json', 'utf8'));
    var sn = t.filter(e => e.screenName === sName);

    return sn.slice(0, 20);
}