
var urllib = require('url');
var http = require('http'), https = require('https');
var Bitly = require('bitly').Bitly;
var settings = require('../local_settings');
var querystring = require('querystring');

exports.expand = function (url, callback) {
    callback = arguments[arguments.length-1];
    if (typeof(callback) != 'function') {
        callback = function () {};
    }

    url = (typeof(url) === 'object') ? url : urllib.parse(url);

    switch (url.host) {
    case 'bit.ly':
    case 'j.mp':
	Unshorteners.bitly(url, callback);
	break;
    case 'is.gd':
        Unshorteners.isgd(url, callback);
        break;
    default:
	Unshorteners.generic(url, callback);
    }
};

var Unshorteners = {

    bitly: function (url, callback) {
	var bitly = new Bitly(settings.bitly.username, settings.bitly.apikey);

	bitly.expand([url.href], function (result) {
            console.log(result);
	    callback(urllib.parse(result.data.expand[0].long_url));
	});
    },

    isgd: function (url, callback) {
        var query = querystring.stringify({format: 'json',
                                           shorturl: url.pathname.replace('/', '')});

        var req = http.get({host: 'is.gd',
                            port: 80,
                            path: '/forward.php?'+query},
                           function (res) {
                               var data = '';
                               res.on('data', function (chunk) {
                                   data += chunk;
                               });
                               res.on('end', function () {
                                   data = JSON.parse(data);

                                   if (data.url) {
                                       callback(urllib.parse(data.url));
                                   }else{
                                       Unshorteners.generic(url, callback);
                                   }
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
