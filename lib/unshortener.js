
var urllib = require('url');
var request = require('request');
var Bitly = require('bitly');
var querystring = require('querystring');
var memcached = require('memcached');
var md5 = require('MD5');
var http = require('http');

var options = {};
var memclient;
http.globalAgent.maxSockets = 20;

exports.config = function(opts) {
   if (typeof(opts.memcache) !== 'undefined') {
        memclient = new memcached(opts.memcache);
   }
}

exports.expand = function (url, opts, callback) {
    callback = arguments[arguments.length-1];
    if (typeof(callback) != 'function') {
        callback = function () {};
    }
    options = (typeof(arguments[1]) !== 'function') ? arguments[1] : {};

    url = (typeof(url) === 'object') ? url : urllib.parse(url);

    if (memclient) {
        memclient.get( md5(url.href), function(err,res) {
            if (res) {
                var resurl = JSON.parse(res);
                if (typeof(resurl) !== 'undefined') {
                    callback(resurl);
                }
            }
        });
    }

    mapping(url, options)(callback);
};

exports.save_url = function(url,result) {
    if (memclient) {
        result = (typeof(result) !== 'undefined') ? result : url;
        memclient.set( md5(url.href), JSON.stringify(result), 1000);
    }
};

var mapping = function (url, options) {
    var map = {
        bitly: ['bit.ly', 'j.mp', 'ericri.es', 'jc.is', 'nyti.ms', 'rww.to',
		'linkd.in', 'win.gs', 'dai.ly', 'imgry.net', 'mln.im', 'theatln.tc'],
        isgd: ['is.gd'],
        googl: ['goo.gl'],
        budurl: ['budurl.com'],
        cligs: ['cli.gs'],
        snipurl: ['snipurl.com', 'snurl.com', 'snurl.com', 'cl.lk', 'snipr.com', 'sn.im']
    };

    for (var k in map) {
        if (map[k].indexOf(url.host) > -1) {
            return function (callback) {
                Unshorteners[k](url, options[k], callback);
            };
        }
    }

    return function (callback) {
        Unshorteners.generic(url, callback);
    };
};

var Unshorteners = {

    bitly: function (url, account, callback) {
        callback = arguments[arguments.length-1];
        if (typeof(account) === 'undefined') {
            Unshorteners.generic(url, callback);
            return;
        }

        var bitly = new Bitly(account.username, account.apikey);

        bitly.expand([url.href], function (err,result) {
            if (result.status_code === 403) {
                Unshorteners.generic(url, callback);
            } else {
                result = result.data.expand[0];
                if (result.error) {
                    Unshorteners.generic(url, callback);
                } else {
                    if (result.long_url.match(/^https?\:\/\//)) {
                        // Expansion is correct
                        exports.save_url(url, urllib.parse(result.long_url));
                        callback(urllib.parse(result.long_url));
                    } else {
                        // Expansion is wrong
                        Unshorteners.generic(url, callback);
                    }

                }
            }
        });
    },

    isgd: function (url, callback) {
        callback = arguments[arguments.length-1];
        var query = '/forward.php?'+querystring.stringify({format: 'json', shorturl: url.pathname.replace('/', '')});

        Unshorteners.__request('http://is.gd' + query, function (data,error) {
            if (error) {
                callback(url,true);
            } else {
                if (data.url) {
                    var eurl = urllib.parse(data.url);
                    exports.save_url(url, eurl);
                    callback(eurl);
                } else {
                    Unshorteners.generic(url, callback);
                }

            }
        });
    },

    googl: function (url, callback) {
        callback = arguments[arguments.length-1];
        var query = '/urlshortener/v1/url?'+querystring.stringify({shortUrl: url.href});

        Unshorteners.__request('https://www.googleapis.com' + query, function (data,error) {
            if (error) {
                Unshorteners.generic(url, callback);
            } else {
                if (data.longUrl) {
                    var eurl = urllib.parse(data.longUrl);
                    exports.save_url(url, eurl);
                    callback(eurl);
                } else {
                    Unshorteners.generic(url, callback);
                }

            }
        });

    },

    budurl: function (url, callback) {
        callback = arguments[arguments.length-1];
        var query = '/api/v1/budurls/expand?'+querystring.stringify({budurl: url.pathname.replace('/', '')});

        Unshorteners.__request('http://budurl.com' + query, function (data,error) {
            if (error) {
                Unshorteners.generic(url, callback);
            } else {
                if (data.long_url) {
                    var eurl = urllib.parse(data.long_url);
                    exports.save_url(url, eurl);
                    callback(eurl);
                } else {
                    Unshorteners.generic(url, callback);
                }
            }
        });
    },

    cligs: function (url, callback) {
        callback = arguments[arguments.length-1];
        var query = '/api/v1/cligs/expand?'+querystring.stringify({clig: url.pathname.replace('/', '')});

        Unshorteners.__request('http://cli.gs' + query, function (data,error) {
            if (error) {
                Unshorteners.generic(url, callback);
            } else {
                var eurl = urllib.parse(data);
                exports.save_url(url, eurl);
                callback(eurl);
            }
        });
    },

    snipurl: function (url, callback) {
        callback = arguments[arguments.length-1];
        var query = '/resolveurl?'+querystring.stringify({id: url.pathname.replace('/', '')});

        Unshorteners.__request('http://snipurl.com' + query, function (data,error) {
            if (error) {
                Unshorteners.generic(url, callback);
            } else {
                var eurl = urllib.parse(data);
                exports.save_url(url, eurl);
                callback(eurl);
            }
        });
    },

    __request: function (url, cb) {
        request.get(url, function(e,r,b) {
            if (!e && r.statusCode == 200) {
                try {
                    cb(JSON.parse(b));
                } catch (e) {
                    if ( e.type === "unexpected_token" ) {
                        cb(b);
                    } else {
                        cb(url, true);
                    }
                }
            } else {
                cb(url, true);
            }
        });

    },

    generic: function (url, callback) {

        var handle = function (err, res) {
            if (!err && res.statusCode === 200){
                var eurl = res.request.uri;

                if ( eurl.href.replace(/[\#\/]$/,'').toLowerCase() === url.href.replace(/[\#\/]$/,'').toLowerCase() ) {
                    exports.save_url(url, url);
                    callback(url);
                } else if (  url.href.replace(/^(.+)(\?.+)$/, "$1/$2") === eurl.href ) {
                    exports.save_url(url, url);
                    callback(url);
                } else {
                    exports.save_url(url, eurl);
                    callback(eurl);
                }
            } else{
                callback(url, true);
            }
        };

        var headers = (url.host === "t.co")?{}:{'User-Agent': 'AppleWebKit/525.13 (KHTML, like Gecko) Safari/525.13.'};
        request.head({ url:url, timeout:10000, headers:headers }, handle);
    }

};

exports.Unshorteners = Unshorteners;
