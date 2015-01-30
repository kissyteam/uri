modulex.add("uri",["util","url"],function(t,n,e){var r,i,u,o=t("util"),s=t("url");r=function(t){function n(t){t._queryMap||(t._queryMap=r.unparam(t._query))}function e(t){this._query=t||""}var r=o;return e.prototype={constructor:e,clone:function(){return new e(this.toString())},reset:function(t){var n=this;return n._query=t||"",n._queryMap=null,n},count:function(){var t,e,i=this,u=0;n(i),t=i._queryMap;for(e in t)r.isArray(t[e])?u+=t[e].length:u++;return u},has:function(t){var e,i=this;return n(i),e=i._queryMap,t?t in e:!r.isEmptyObject(e)},get:function(t){var e,r=this;return n(r),e=r._queryMap,t?e[t]:e},keys:function(){var t=this;return n(t),r.keys(t._queryMap)},set:function(t,i){var u,o=this;return n(o),u=o._queryMap,"string"==typeof t?o._queryMap[t]=i:(t instanceof e&&(t=t.get()),r.each(t,function(t,n){u[n]=t})),o},remove:function(t){var e=this;return n(e),t?delete e._queryMap[t]:e._queryMap={},e},add:function(t,r){var i,u,o=this;if("string"==typeof t)n(o),i=o._queryMap,u=i[t],u=void 0===u?r:[].concat(u).concat(r),i[t]=u;else{t instanceof e&&(t=t.get());for(var s in t)o.add(s,t[s])}return o},toString:function(){var t=this;return n(t),r.param(t._queryMap)}},t=e}(),i=function(t){function n(t){return 1===t.length?"0"+t:t}function e(t,n){return t.toLowerCase()===n.toLowerCase()}function i(t,e){return encodeURI(t).replace(e,function(t){return"%"+n(t.charCodeAt(0).toString(16))})}function u(t){return t instanceof u?t.clone():(c.mix(this,new a(t)),this.query=this.search.substring(1),this.scheme=this.protocol,this)}var a=s,c=o,h=r,f=/[#@]/g,p={scheme:1,hostname:2,port:3,path:4,query:5,fragment:6};return c.extend(u,a,{clone:function(){var t=new u,n=this;return c.each(p,function(e,r){t[r]=n[r]}),t.query=t.query.clone(),t},resolve:function(t){return"string"!=typeof t&&(t=new u(t).toString()),new u(a.resolve(t,this))},getScheme:function(){return this.scheme},setScheme:function(t){return this.scheme=t,this},getHostname:function(){return this.hostname},setHostname:function(t){return this.hostname=t,this},setPort:function(t){return this.port=t,this},getPort:function(){return this.port},setPath:function(t){return this.path=t,this},getPath:function(){return this.path},setQuery:function(t){return"string"==typeof t&&(c.startsWith(t,"?")&&(t=t.slice(1)),t=new h(i(t,f))),this.query=t,this.search="?"+c.param(t),this},getQuery:function(){return this.query},getFragment:function(){return this.fragment},setFragment:function(t){var n=this;return c.startsWith(t,"#")&&(t=t.slice(1)),n.fragment=t,n},isSameOriginAs:function(t){var n=this;return e(n.hostname,t.hostname)&&e(n.scheme,t.scheme)&&e(n.port,t.port)}}),u.Query=h,t=u}(),u=function(t){return t=i,e.exports.version="1.0.4",t}(),e.exports=u});