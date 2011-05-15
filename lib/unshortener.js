
var urllib = require('url');
var http = require('http'), https = require('https');

exports.expand = function (url, callback) {
    callback = callback || function () {};

    url = (typeof(url) === 'object') ? url : urllib.parse(url);

    console.log(url);

    var req;
    var options = {host: url.host,
                   port: 80,
                   path: url.pathname,
                   method: 'HEAD'};

    var handle = function (res) {
        console.log(res);
    };

    req = (url.protocol === 'http') ? http.request(options, handle)
                                    : https.request(options, handle);
    req.end();
};
