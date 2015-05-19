/**
 * extract from in a connect promise style
 * where
 *  data[0].data is facebook
 *  data[1] is twitter
 * @param  {Object}
 * @return {Object}
 */
exports.extract = function (data) {
	var facebook = data[0].data;
	var twitter = data[1];

	return {facebook: facebook, twitter: twitter};
};

/**
 * concat a connect object to array
 * @param  {Object}
 * @return {Array}
 */
exports.concat = function (data) {
	var result = [];

	return result.concat(data.facebook, data.twitter);
};

/**
 * responseWith puts data in a field
 * @param  {String} fieldName
 * @param  {data} Any
 * @return {Object}
 */
exports.responseWith = function (fieldName, data) {
	var resp = {};
	resp[fieldName] = data;
	return resp;
};

exports.responseWithError = function (err) {
	return {err: err};
}

exports.fromField = function (fieldName, data) {
	return data[fieldName];
};

/**
 * Applies a formater to each network
 * @param  {Object} Formater
 * @param  {Object}
 * @return {Object}
 */
exports.format = function (Formater, data) {
	var facebook = Formater.facebook(data.facebook);
	var twitter = Formater.twitter(data.twitter);
	return {facebook: facebook, twitter: twitter};
};
