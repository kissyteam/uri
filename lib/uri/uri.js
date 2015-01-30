/**
 * @ignore
 * Uri class for KISSY.
 * @author yiminghe@gmail.com
 */
var _URL = require('url');

var util = require('util');

var Query = require('./query');

// ?? combo of taobao
var	reDisallowedInQuery = /[#@]/g,

	REG_INFO = {
		scheme: 1,
		hostname: 2,
		port: 3,
		path: 4,
		query: 5,
		fragment: 6
	};

function padding2(str) {
	return str.length === 1 ? '0' + str : str;
}

function equalsIgnoreCase(str1, str2) {
	return str1.toLowerCase() === str2.toLowerCase();
}

// www.ta#bao.com // => www.ta.com/#bao.com
// www.ta%23bao.com
// Percent-Encoding
function encodeSpecialChars(str, specialCharsReg) {
	// encodeURI( ) is intended to encode complete URIs,
	// the following ASCII punctuation characters,
	// which have special meaning in URIs, are not escaped either:
	// ; / ? : @ & = + $ , #
	return encodeURI(str).replace(specialCharsReg, function (m) {
		return '%' + padding2(m.charCodeAt(0).toString(16));
	});
}

/**
 * @class KISSY.Uri
 * Uri class for KISSY.
 * Most of its interfaces are same with window.location.
 * @param {String|KISSY.Uri} [uriStr] Encoded uri string.
 */
function Uri(uriStr) {

	if (uriStr instanceof  Uri) {
		return uriStr.clone();
	}

	util.mix(this, new _URL(uriStr));

	// add query
	this.query = this.search.substring(1);
	this.scheme = this.protocol;

	return this;

}

util.extend(Uri, _URL, {

	/**
	 * Return a cloned new instance.
	 * @return {KISSY.Uri}
	 */
	clone: function () {
		var uri = new Uri(), self = this;
		util.each(REG_INFO, function (index, key) {
			uri[key] = self[key];
		});
		uri.query = uri.query.clone();
		return uri;
	},

	/**
	 * The reference resolution algorithm.rfc 5.2
	 * return a resolved uri corresponding to current uri
	 * @param {KISSY.Uri|String} relativeUri
	 *
	 * for example:
	 *      @example
	 *      this: 'http://y/yy/z.com?t=1#v=2'
	 *      'https:/y/' => 'https:/y/'
	 *      '//foo' => 'http://foo'
	 *      'foo' => 'http://y/yy/foo'
	 *      '/foo' => 'http://y/foo'
	 *      '?foo' => 'http://y/yy/z.com?foo'
	 *      '#foo' => http://y/yy/z.com?t=1#foo'
	 *
	 * @return {KISSY.Uri}
	 */
	resolve: function (relativeUri) {

		if ('string' !== typeof relativeUri) {
			relativeUri = new Uri(relativeUri).toString();
		}

		return new Uri(_URL.resolve(relativeUri, this));

	},

	/**
	 * Get scheme part
	 */
	getScheme: function () {
		return this.scheme;
	},

	/**
	 * Set scheme part
	 * @param {String} scheme
	 * @chainable
	 */
	setScheme: function (scheme) {
		this.scheme = scheme;
		return this;
	},

	/**
	 * Return hostname
	 * @return {String}
	 */
	getHostname: function () {
		return this.hostname;
	},

	/**
	 * Set hostname
	 * @param {String} hostname
	 * @chainable
	 */
	setHostname: function (hostname) {
		this.hostname = hostname;
		return this;
	},

//	/**
//	 * Set user info
//	 * @param {String} userInfo
//	 * @chainable
//	 */
//	'setUserInfo': function (userInfo) {
//		this.userInfo = userInfo;
//		return this;
//	},
//
//	/**
//	 * Get user info
//	 * @return {String}
//	 */
//	getUserInfo: function () {
//		return this.userInfo;
//	},

	/**
	 * Set port
	 * @param {String} port
	 * @chainable
	 */
	setPort: function (port) {
		this.port = port;
		return this;
	},

	/**
	 * Get port
	 * @return {String}
	 */
	getPort: function () {
		return this.port;
	},

	/**
	 * Set path
	 * @param {string} path
	 * @chainable
	 */
	setPath: function (path) {
		this.path = path;
		return this;
	},

	/**
	 * Get path
	 * @return {String}
	 */
	getPath: function () {
		return this.path;
	},

	/**
	 * Set query
	 * @param {String|KISSY.Uri.Query} query
	 * @chainable
	 */
	setQuery: function (query) {
		if (typeof query === 'string') {
			if (util.startsWith(query, '?')) {
				query = query.slice(1);
			}
			query = new Query(encodeSpecialChars(query, reDisallowedInQuery));
		}
		this.query = query;
		// 修改 search
		this.search = '?' + util.param(query);
		return this;
	},

	/**
	 * Get query
	 * @return {KISSY.Uri.Query}
	 */
	getQuery: function () {
		return this.query;
	},

	/**
	 * Get fragment
	 * @return {String}
	 */
	getFragment: function () {
		return this.fragment;
	},

	/**
	 * Set fragment
	 * @param {String} fragment
	 * @chainable
	 */
	setFragment: function (fragment) {
		var self = this;
		if (util.startsWith(fragment, '#')) {
			fragment = fragment.slice(1);
		}
		self.fragment = fragment;
		return self;
	},

	/**
	 * Judge whether two uri has same domain.
	 * @param {KISSY.Uri} other
	 * @return {Boolean}
	 */
	isSameOriginAs: function (other) {
		var self = this;
		// port and hostname has to be same
		return equalsIgnoreCase(self.hostname, other.hostname) &&
			equalsIgnoreCase(self.scheme, other.scheme) &&
			equalsIgnoreCase(self.port, other.port);
	}
});

Uri.Query = Query;

module.exports = Uri;

/*
 Refer
 - application/x-www-form-urlencoded
 - http://www.ietf.org/rfc/rfc3986.txt
 - http://en.wikipedia.org/wiki/URI_scheme
 - http://unixpapa.com/js/querystring.html
 - http://code.stephenmorley.org/javascript/parsing-query-strings-for-get-data/
 - same origin: http://tools.ietf.org/html/rfc6454
 */
