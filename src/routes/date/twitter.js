const get = require('../../methods/getMethods');

module.exports = (req, res) => {

    const modelId = req.query.screenName;
    var model = null;
    if (modelId) {
        model = get.getTwitterSN(modelId);
    } else {
        model = get.getTwitter();
    }

    res.status(200).json(model);
};