const compose = require('lodash/fp/compose');

const urlDecode = function(string){
	return decodeURI(string)
}

const urlEncode = function(string){
	return encodeURI(string)
}

const escapeSingleQuote  = function(string){
	return string.replace(/[']/g, '&#39;')
}

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

const fbHashTag = function(string){
	return string.replace(/(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://facebook.com/hashtag/$2?fref=mentions\">#$2</a>')
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
	escapeSingleQuote,
	urlDecode,
	urlEncode,
	);

const facebookTextFormatter = compose(
	fbHashTag,
	linksToHTMLLink,
	);

module.exports = {
	twitterTextFormatter: twitterTextFormatter,
	instaHashTag: instaHashTag,
	facebookTextFormatter: facebookTextFormatter
}

/*exports.twitterTextFormat = function(string){
	return string.replace(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm, '<a href=\"$&\">$&</a>')
	.replace(/(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/hashtag/$2?src=hash\">#$2</a>')
	.replace(/(^|\B)@(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g, '<a href=\"http://twitter.com/$2\">@$2</a>')
	
}*/