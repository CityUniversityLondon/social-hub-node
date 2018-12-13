exports.sortJson = function(j) {
    "use strict";
    var s = [].concat(...r);
    s.sort(function(a, b) {
        return new Date(b.timeCreated * 1000) - new Date(a.timeCreated * 1000);
    });

    return s
}