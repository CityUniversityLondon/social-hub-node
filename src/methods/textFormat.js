const compose = require('lodash/fp/compose');

hashTag = function(string){
	return string.replace(/(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/hashtag/$2?src=hash\">#$2</a>')
}

emailSign = function(string){
	return string.replace(/(^|\B)@(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/$2\">@$2</a>')
}

linksToHTMLLink = function(string){
	return string.replace(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm, '<a href=\"$&\">$&</a>')
}

const twitterTextFormatter = compose(
	hashTag,
	emailSign,
	linksToHTMLLink
	);

module.exports = {
	twitterTextFormatter:twitterTextFormatter
}

/*exports.twitterTextFormat = function(string){
	return string.replace(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm, '<a href=\"$&\">$&</a>')
	.replace(/(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/hashtag/$2?src=hash\">#$2</a>')
	.replace(/(^|\B)@(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/$2\">@$2</a>')
	
}*/