var urllib = require('url');
var request = require('request');
var querystring = require('querystring');
var memcached = require('memcached');
var hash = require('node_hash');

var options = {};
var memclient;
var map = {
    bitly: {
        'hosts': ['bit.ly', 'j.mp', 'ericri.es', 'jc.is', 'nyti.ms', 'rww.to', 'linkd.in', 'win.gs', 'dai.ly', 'imgry.net', 'mln.im', 'theatln.tc', 'rvtra.de', 'amzn.to'],
        'active': true
    },
    isgd: {
        'hosts': ['is.gd'],
        'active': true
    },
    googl: {
        'hosts': ['goo.gl'],
        'active': true
    },
    budurl: {
        'hosts': ['budurl.com'],
        'active': true
    },
    // cligs API no longer works and it doesn't look easily translatable anymore
/*    cligs: {
        'hosts': ['cli.gs'],
        'active': false
    },*/
    snipurl: {
        'hosts': ['snipurl.com', 'snurl.com', 'cl.lk', 'snipr.com', 'sn.im'],
        'active': true
    }
};

exports.config = function(opts) {
   if (typeof(opts.memcache) !== 'undefined') {
        memclient = new memcached(opts.memcache);
   }
   if (typeof(opts.proxy) !== 'undefined') {
        request.defaults({'proxy':opts.proxy});
   }
}

exports.expand = function (url, opts, callback) {
    callback = arguments[arguments.length-1];
    if (typeof(callback) != 'function') {
        callback = function () {};
    }
    options = (typeof(arguments[1]) !== 'function') ? arguments[1] : {};

    url = (typeof(url) === 'object') ? url : urllib.parse(url);

    if (typeof(options.proxy) !== 'undefined') {
        request.defaults({'proxy':options.proxy});
    }

    if (memclient) {
        memclient.get( hash.sha256(url.href), function(err,res) {
            if (res) {
                var resurl = JSON.parse(res);
                if (typeof(resurl) !== 'undefined') {
                    callback(null, resurl);
                }
            }
        });
    }

    mapping(url)(callback);
};

exports.saveUrl = function(url,result) {
    if (memclient) {
        result = (typeof(result) !== 'undefined') ? result : url;
        memclient.set( hash.sha256(url.href), JSON.stringify(result), 1000);
    }
};

exports.extractUrl = function(url) {
    return url.match(/^[^\?]+/)[0];
};

exports.toggleApi = function(api, retry) {
    if (api && map[api]) {
        map[api].active = (map[api].active) ? false : true;
        if ( retry && ( typeof retry === 'number' && retry % 1 == 0 ) ) {
            if (typeof(map[api].timer) !== 'undefined') {
                // Timer is already set, clear it then set another
                clearTimeout(map[api].timer);
                delete map[api].timer;
            }
            // Set toggle timeout
            map[api].timer = setTimeout(exports.toggleApi)
        }
    }
}

var mapping = function (url) {
    for (var k in map) {
        if (map[k]['hosts'].indexOf(url.host) > -1 && map[k].active) {
            return function (callback) {
                Unshorteners[k](url, options[k], callback);
            };
        }
    }

    if (map['bitly'].active && options['bitly']) {
        var qs = { domain: url.hostname,  login: options['bitly'].username, apiKey: options['bitly'].apikey };
        var query = '/v3/bitly_pro_domain?' + querystring.stringify(qs);
        Unshorteners.__request('https://api-ssl.bitly.com' + query, function (error,data) {
            if (error) {
                return function (callback) {
                    Unshorteners.generic(url, callback);
                };
            } else {
                if (data.status_code && data.status_code >= 200 && data.status_code < 300){
                    if (data.data.bitly_pro_domain) {
                        return function (callback) {
                            map['bitly']['hosts'].push(url.hostname);
                            Unshorteners.bitly(url, options['bitly'], callback);
                        };
                    } else {
                        return function (callback) {
                            Unshorteners.generic(url, callback);
                        };
                    }
                } else {
                    return function (callback) {
                        Unshorteners.generic(url, callback);
                    };
                }
            }
        });
    }

    return function (callback) {
        Unshorteners.generic(url, callback);
    };
};

var Unshorteners = {

    bitly: function (url, account, callback) {
        callback = arguments[arguments.length-1];
        if (typeof(account) === 'undefined') {
            exports.toggleApi('bitly');
            Unshorteners.generic(url, callback);
            return;
        }
        var qs = { shortUrl: exports.extractUrl(url.href),  login: account.username, apiKey: account.apikey };
        var query = '/v3/expand/url?'+querystring.stringify(qs);

        Unshorteners.__request('https://api-ssl.bitly.com' + query, function (error,data) {
            if (error) {
                exports.toggleApi('bitly', 3600000);
                Unshorteners.generic(url, callback);
            } else {
                if (data.status_code && data.status_code >= 200 && data.status_code < 300){
                    var result = data.data.expand[0];
                    if (result.long_url) {
                        var eurl = urllib.parse(result.long_url);
                        exports.saveUrl(url, eurl);
                        callback(null, eurl);
                    } else {
                        Unshorteners.generic(url, callback);
                    }
                } else {
                    exports.toggleApi('bitly', 3600000);
                    Unshorteners.generic(url, callback);
                }
            }
        });

    },

    isgd: function (url, callback) {
        callback = arguments[arguments.length-1];
        var query = '/forward.php?'+querystring.stringify({format: 'json', shorturl: url.pathname.replace('/', '')});

        Unshorteners.__request('http://is.gd' + query, function (error,data) {
            if (error) {
                exports.toggleApi('isgd', 3600000);
                Unshorteners.generic(url, callback);
            } else {
                if (data.url) {
                    var eurl = urllib.parse(data.url);
                    exports.saveUrl(url, eurl);
                    callback(null, eurl);
                } else {
                    Unshorteners.generic(url, callback);
                }

            }
        });
    },

    googl: function (url, apikey, callback) {
        callback = arguments[arguments.length-1];
        var qs = { shortUrl: exports.extractUrl(url.href) };
        if (typeof(apikey) === 'string') {
            qs['key'] = apikey;
        }
        var query = '/urlshortener/v1/url?'+querystring.stringify(qs);

        Unshorteners.__request('https://www.googleapis.com' + query, function (error,data) {
            if (error) {
                exports.toggleApi('googl', 86400000);
                Unshorteners.generic(url, callback);
            } else {
                if (data.longUrl) {
                    var eurl = urllib.parse(data.longUrl);
                    exports.saveUrl(url, eurl);
                    callback(null, eurl);
                } else {
                    Unshorteners.generic(url, callback);
                }

            }
        });

    },

    budurl: function (url, callback) {
        callback = arguments[arguments.length-1];
        var query = '/api/v1/budurls/expand?'+querystring.stringify({budurl: url.pathname.replace('/', '')});

        Unshorteners.__request('http://budurl.com' + query, function (error,data) {
            if (error) {
                exports.toggleApi('budurl', 3600000);
                Unshorteners.generic(url, callback);
            } else {
                if (data.long_url) {
                    var eurl = urllib.parse(data.long_url);
                    exports.saveUrl(url, eurl);
                    callback(null, eurl);
                } else {
                    Unshorteners.generic(url, callback);
                }
            }
        });
    },

    cligs: function (url, callback) {
        callback = arguments[arguments.length-1];
        var query = '/api/v1/cligs/expand?'+querystring.stringify({clig: url.pathname.replace('/', '')});

        Unshorteners.__request('http://cli.gs' + query, function (error,data) {
            if (error) {
                exports.toggleApi('cligs', 3600000);
                Unshorteners.generic(url, callback);
            } else {
                var eurl = urllib.parse(data);
                exports.saveUrl(url, eurl);
                callback(null, eurl);
            }
        });
    },

    snipurl: function (url, callback) {
        callback = arguments[arguments.length-1];
        var query = '/resolveurl?'+querystring.stringify({id: url.pathname.replace('/', '')});

        Unshorteners.__request('http://snipurl.com' + query, function (error,data) {
            if (error) {
                exports.toggleApi('snipurl', 3600000);
                Unshorteners.generic(url, callback);
            } else {
                var eurl = urllib.parse(data);
                exports.saveUrl(url, eurl);
                callback(null, eurl);
            }
        });
    },

    __request: function (url, cb) {
        var cookie_jar = request.jar();
        request.get(url, { url:url, jar: cookie_jar }, function(e,r,b) {
            if ( !e && r.statusCode && r.statusCode >= 200 && r.statusCode < 300 ) {
                try {
                    cb(null, JSON.parse(b));
                } catch (e) {
                    if ( e.type === "unexpected_token" ) {
                        cb(null, b);
                    } else {
                        cb(e, url);
                    }
                }
            } else {
                if (!e) {
                    var e = new Error('API failed');
                    e.statusCode = r.statusCode;
                }
                cb(e, url);
            }
        });

    },

    generic: function (url, callback) {
        var cookie_jar = request.jar();
        var headers = (url.host === "t.co")?{}:{'User-Agent': 'AppleWebKit/525.13 (KHTML, like Gecko) Safari/525.13.'};
        var handle = function (err, res) {
            if ( !err && res.statusCode && res.statusCode >= 200 && res.statusCode < 300 ) {
                var eurl = res.request.uri;

                if ( eurl.href.replace(/[\#\/]$/,'').toLowerCase() === url.href.replace(/[\#\/]$/,'').toLowerCase() ) {
                    exports.saveUrl(url, url);
                    callback(null, url);
                } else if (  url.href.replace(/^(.+)(\?.+)$/, "$1/$2") === eurl.href ) {
                    exports.saveUrl(url, url);
                    callback(null, url);
                } else {
                    var pn = url.pathname;
                    if (!pn.match(/\/$/)) {
                        pn += '/';
                    }
                    var rpn = res.request.uri.pathname;
                    if (!rpn.match(/\/$/)) {
                        rpn += '/';
                    }
                    re = new RegExp('^' + pn + '$')

                    if (url.hostname === res.request.uri.hostname && rpn.match(re)) {
                        exports.saveUrl(url, url);
                        callback(null, url);
                    } else {
                        exports.saveUrl(url, eurl);
                        callback(null, eurl);
                    }
                }
            } else{
                if (!err) {
                    var err = new Error('Resolution failed');
                    err.statusCode = res.statusCode;
                    if (res.statusCode === 405) {
                        return request.get({ url:url, timeout:10000, headers:headers, jar: cookie_jar }, handle);
                    }
                }
                callback(err, url);
            }
        };
        request.head({ url:url, timeout:10000, headers:headers, jar: cookie_jar }, handle);
    }

};

exports.Unshorteners = Unshorteners;
