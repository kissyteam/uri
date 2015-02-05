//! Copyright 2015, kissy-uri@1.0.4 MIT Licensed, build time: Thu, 05 Feb 2015 06:54:59 GMT 
modulex.add("uri", ["util","url"], function(require, exports, module) {
var _util_ = require("util");
var url = require("url");
/*
combined modules:
uri
uri/query
uri/uri
*/
var uriQuery, uriUri, _uri_;
uriQuery = function (exports) {
  /**
   * @ignore
   * Uri class for KISSY.
   * @author yiminghe@gmail.com
   */
  var util = _util_;
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
      var self = this, count = 0, _queryMap, k;
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
      var self = this, _queryMap, currentValue;
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
  exports = Query;
  return exports;
}();
uriUri = function (exports) {
  /**
   * @ignore
   * Uri class for KISSY.
   * @author yiminghe@gmail.com
   */
  var _URL = url;
  var util = _util_;
  var Query = uriQuery;
  // ?? combo of taobao
  var reDisallowedInQuery = /[#@]/g, REG_INFO = {
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
    if (uriStr instanceof Uri) {
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
      return equalsIgnoreCase(self.hostname, other.hostname) && equalsIgnoreCase(self.scheme, other.scheme) && equalsIgnoreCase(self.port, other.port);
    }
  });
  Uri.Query = Query;
  exports = Uri;
  return exports;
}();
_uri_ = function (exports) {
  uriQuery;
  uriUri;
  exports = uriUri;
  module.exports.version = '1.0.4';
  return exports;
}();
module.exports = _uri_;
});