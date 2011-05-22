
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

    switch (url.host) {
    case 'bit.ly':
    case 'j.mp':
        if (options.bitly) {
	    Unshorteners.bitly(url, options.bitly, callback);
        }else{
            Unshorteners.generic(url, callback);
        }
	break;
    case 'is.gd':
        Unshorteners.isgd(url, callback);
        break;
    default:
	Unshorteners.generic(url, callback);
    }
};

var Unshorteners = {

    bitly: function (url, account, callback) {
	var bitly = new Bitly(account.username, account.apikey);

	bitly.expand([url.href], function (result) {
	    callback(urllib.parse(result.data.expand[0].long_url));
	});
    },

    isgd: function (url, callback) {
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
                                     data = JSON.parse(data);

                                     callback(data);
                                 });
                             });
    },

    generic: function (url, callback) {

	var req;
	var options = {host: url.host,
                       port: 80,
                       path: url.pathname,
		       headers: {'User-Agent': 'AppleWebKit/525.13 (KHTML, like Gecko) Safari/525.13.'},
                       method: 'HEAD'};

	var handle = function (res) {
	    if (res.statusCode === 301 || res.statusCode === 302) {
		exports.expand(res.headers.location, callback);
	    }else{
		callback(url);
	    }
	};

	req = (url.protocol === 'http:') ? http.request(options, handle)
            : https.request(options, handle);
	req.end();

    }

};

exports.Unshorteners = Unshorteners;
