var all = require('../../json/all.json');

exports.getJson = function(){
    var sl = all.slice(0,20);
    return sl
}

exports.getJsonById = function(id) {
    var index = all.findIndex((e) => {
        return e.itemRef === id
    });

    var e = index + 20;

    return all.slice(index, e)
}

