
var urllib = require('url');
var http = require('http'), https = require('https');
var Bitly = require('bitly').Bitly;
var settings = require('../local_settings');

exports.expand = function (url, callback) {
    callback = callback || function () {};

    url = (typeof(url) === 'object') ? url : urllib.parse(url);

    switch (url.host) {
    case 'bit.ly':
	Unshorteners.bitly(url, callback);
	break;
    default:
	Unshorteners.generic(url, callback);
    }
};

var Unshorteners = {

    bitly: function (url, callback) {
	var bitly = new Bitly(settings.bitly.username, settings.bitly.apikey);

	bitly.expand([url.href], function (result) {
	    callback(urllib.parse(result.data.expand[0].long_url));
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