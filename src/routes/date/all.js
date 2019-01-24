const get = require('../../methods/getMethods');

module.exports = (req, res) => {

    const modelId = req.query.itemRef;

    if (modelId) {
        get.getJsonById(modelId).then(r => res.status(200).json(r));
    } else {
        get.getJson().then(r => res.status(200).json(r));
    }

    
};