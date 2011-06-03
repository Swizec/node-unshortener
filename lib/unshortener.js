
var urllib = require('url');
var http = require('http'), https = require('https');
var Bitly = require('bitly').Bitly;
var querystring = require('querystring');

exports.expand = function (url, options, callback) {
    callback = arguments[arguments.length-1];
    if (typeof(callback) != 'function') {
        callback = function () {};
    }
    options = (typeof(arguments[1]) !== 'function') ? arguments[1] : {};

    url = (typeof(url) === 'object') ? url : urllib.parse(url);

    mapping(url, options)(callback);
};

var mapping = function (url, options) {
    var map = {
        bitly: ['bit.ly', 'j.mp', 'ericri.es', 'jc.is', 'nyti.ms',
		'linkd.in', 'win.gs', 'dai.ly', 'imgry.net', 'mln.im', 'theatln.tc'],
        isgd: ['is.gd'],
        googl: ['goo.gl']
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

	bitly.expand([url.href], function (result) {
            result = result.data.expand[0];
            if (result.error) {
                callback(url, true);
            }else{
	        callback(urllib.parse(result.long_url));
            }
	});
    },

    isgd: function (url, callback) {
        callback = arguments[arguments.length-1];

        var query = '/forward.php?'+
                querystring.stringify({format: 'json',
                                       shorturl: url.pathname.replace('/', '')});

        Unshorteners.__request(query, 'is.gd', http,
                               function (data) {
                                   if (data.url) {
                                       callback(urllib.parse(data.url));
                                   }else{
                                       Unshorteners.generic(url, callback);
                                   }
                               });
    },

    googl: function (url, callback) {
        callback = arguments[arguments.length-1];

        var query = '/urlshortener/v1/url?'+querystring.stringify({shortUrl: url.href});

        Unshorteners.__request(query, 'www.googleapis.com', https,
                               function (data) {
                                   callback(urllib.parse(data.longUrl));
                               });

    },

    __request: function (query, host, module, callback) {
        var req = module.get({host: host,
                              path: query},
                             function (res) {
                                 var data = '';
                                 res.on('data', function (chunk) {
                                     data += chunk;
                                 });
                                 res.on('end', function () {
                                     callback(JSON.parse(data));
                                 });
                                 res.on('close', function () {
                                     callback(JSON.parse(data));
                                 });
                             }).on('error', function (e) {
                                 callback(url, true);
                             });
    },

    generic: function (url, callback) {

	var req;
	var options = {host: url.host,
                       path: url.pathname,
		       headers: {'User-Agent': 'AppleWebKit/525.13 (KHTML, like Gecko) Safari/525.13.'},
                       method: 'HEAD'};

	var handle = function (res) {
	    if (res.statusCode === 301 || res.statusCode === 302) {
		exports.expand(res.headers.location, callback);
	    }else if (res.statusCode === 200){
		callback(url);
	    }else{
                callback(url, true);
            }
	};

	req = (url.protocol === 'http:') ? http.request(options, handle)
            : https.request(options, handle);
	req.end();
        req.on('error', function (e) {
            callback(url, true);
        });
    }

};

exports.Unshorteners = Unshorteners;
