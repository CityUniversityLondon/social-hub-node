const get = require('../../social-api/getMethods');

module.exports = (req, res) => {
  const modelId = req.params.Id;
  const model = get.getJsonById(modelId)

  res.status(200).json( model );
};