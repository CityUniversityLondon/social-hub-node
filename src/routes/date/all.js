const get = require('../../social-api/getMethods');

module.exports = (req, res) => {
	const j = get.getJson();
  res.status(200).json(j);
};