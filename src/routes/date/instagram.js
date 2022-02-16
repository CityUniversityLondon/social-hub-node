const get = require('../../methods/getMethods');

module.exports = (req, res) => {

    const modelId = req.query.screenName;

    if (modelId) {
        get.getInstagramSN(modelId).then(r => {
            res.status(200).json(r);
        });
    }
    else {
        get.getInstagram().then(r => res.status(200).json(r));
    }
};