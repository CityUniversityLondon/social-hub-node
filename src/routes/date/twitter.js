const get = require('../../methods/getMethods');
var t = require('../../methods/twitterHashTagSearch');

module.exports = (req, res) => {

    const modelId = req.query.screenName;
    const hashTag = req.query.hashTag;
    var model = null;


    if (modelId) {
        get.getTwitterSN(modelId).then(r => {
            res.status(200).json(r);
        });

    } else if (hashTag){
        model = t.twitter(hashTag).then(r => {
            res.status(200).json(r);
        });
    }
     else {
        get.getTwitter().then(r => res.status(200).json(r));
    }
};