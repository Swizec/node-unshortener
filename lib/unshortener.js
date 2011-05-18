
var urllib = require('url');
var http = require('http'), https = require('https');

exports.expand = function (url, callback) {
    callback = callback || function () {};

    url = (typeof(url) === 'object') ? url : urllib.parse(url);

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
};
