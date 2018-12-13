const get = require('../../methods/getMethods');

module.exports = (req, res) => {
  const modelId = req.query.itemRef;
  const model = get.getJsonById(modelId)

  res.status(200).json( model );
};