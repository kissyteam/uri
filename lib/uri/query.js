/**
 * @ignore
 * Uri class for KISSY.
 * @author yiminghe@gmail.com
 */
var util = require('util');

function parseQuery(self) {
	if (!self._queryMap) {
		self._queryMap = util.unparam(self._query);
	}
}

/**
 * @class KISSY.Uri.Query
 * Query data structure.
 * @param {String} [query] encoded query string(without question mask).
 */
function Query(query) {
	this._query = query || '';
}

Query.prototype = {
	constructor: Query,

	/**
	 * Cloned new instance.
	 * @return {KISSY.Uri.Query}
	 */
	clone: function () {
		return new Query(this.toString());
	},

	/**
	 * reset to a new query string
	 * @param {String} query
	 * @chainable
	 */
	reset: function (query) {
		var self = this;
		self._query = query || '';
		self._queryMap = null;
		return self;
	},

	/**
	 * Parameter count.
	 * @return {Number}
	 */
	count: function () {
		var self = this,
			count = 0,
			_queryMap,
			k;
		parseQuery(self);
		_queryMap = self._queryMap;
		for (k in _queryMap) {

			if (util.isArray(_queryMap[k])) {
				count += _queryMap[k].length;
			} else {
				count++;
			}

		}
		return count;
	},

	/**
	 * judge whether has query parameter
	 * @param {String} [key]
	 */
	has: function (key) {
		var self = this, _queryMap;
		parseQuery(self);
		_queryMap = self._queryMap;
		if (key) {
			return key in _queryMap;
		} else {
			return !util.isEmptyObject(_queryMap);
		}
	},

	/**
	 * Return parameter value corresponding to current key
	 * @param {String} [key]
	 */
	get: function (key) {
		var self = this, _queryMap;
		parseQuery(self);
		_queryMap = self._queryMap;
		if (key) {
			return _queryMap[key];
		} else {
			return _queryMap;
		}
	},

	/**
	 * Parameter names.
	 * @return {String[]}
	 */
	keys: function () {
		var self = this;
		parseQuery(self);
		return util.keys(self._queryMap);
	},

	/**
	 * Set parameter value corresponding to current key
	 * @param {String} key
	 * @param value
	 * @chainable
	 */
	set: function (key, value) {
		var self = this, _queryMap;
		parseQuery(self);
		_queryMap = self._queryMap;
		if (typeof key === 'string') {
			self._queryMap[key] = value;
		} else {
			if (key instanceof Query) {
				key = key.get();
			}
			util.each(key, function (v, k) {
				_queryMap[k] = v;
			});
		}
		return self;
	},

	/**
	 * Remove parameter with specified name.
	 * @param {String} key
	 * @chainable
	 */
	remove: function (key) {
		var self = this;
		parseQuery(self);
		if (key) {
			delete self._queryMap[key];
		} else {
			self._queryMap = {};
		}
		return self;

	},

	/**
	 * Add parameter value corresponding to current key
	 * @param {String} key
	 * @param value
	 * @chainable
	 */
	add: function (key, value) {
		var self = this,
			_queryMap,
			currentValue;
		if (typeof key === 'string') {
			parseQuery(self);
			_queryMap = self._queryMap;
			currentValue = _queryMap[key];
			if (currentValue === undefined) {
				currentValue = value;
			} else {
				currentValue = [].concat(currentValue).concat(value);
			}
			_queryMap[key] = currentValue;
		} else {
			if (key instanceof Query) {
				key = key.get();
			}
			for (var k in key) {
				self.add(k, key[k]);
			}
		}
		return self;
	},

	/**
	 * Serialize query to string.
	 */
	toString: function () {
		var self = this;
		parseQuery(self);
		return util.param(self._queryMap);
	}
};

module.exports = Query;
