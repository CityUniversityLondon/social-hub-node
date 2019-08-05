const compose = require('lodash/fp/compose');

const hashTag = function(string){
	return string.replace(/(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/hashtag/$2?src=hash\">#$2</a>')
}

const emailSign = function(string){
	return string.replace(/(^|\B)@(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/$2\">@$2</a>')
}

const linksToHTMLLink = function(string){
	return string.replace(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm, '<a href=\"$&\">$&</a>')
}

const instaHashTag = function(string){
	return string.replace(/(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://instagram.com/$2\">@$2</a>')
}

const escape = function(string){
	return string
		.replace(/[\"]/g, '\\"')
		.replace(/[\\]/g, '\\\\')
		.replace(/[\/]/g, '\\/')
		.replace(/[\b]/g, '\\b')
		.replace(/[\f]/g, '\\f')
		.replace(/[\n]/g, '\\n')
		.replace(/[\r]/g, '\\r')
		.replace(/[\t]/g, '\\t')
}

const twitterTextFormatter = compose(
	hashTag,
	emailSign,
	linksToHTMLLink,
	);

module.exports = {
	twitterTextFormatter: twitterTextFormatter,
	instaHashTag: instaHashTag
}

/*exports.twitterTextFormat = function(string){
	return string.replace(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm, '<a href=\"$&\">$&</a>')
	.replace(/(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/hashtag/$2?src=hash\">#$2</a>')
	.replace(/(^|\B)@(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/$2\">@$2</a>')
	
}*/