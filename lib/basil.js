
var async = require('async');
var urllib = require('url');
var jsdom = require('jsdom');
var http = require('http');
var urllib = require('url');
var unshortener = require('./unshortener');

var urls = function (text, callback) {
    async.filter(text.split(' '),
                 function (item, callback) {
                     callback(item.substr(0, 7) === 'http://');
                 },
                 callback);
};

var services = ['instagr.am', 'yfrog.com', 'twitpic.com', 'picplz.com'];

exports.get_pic_link = function (tweet, callback) {
    callback = callback || function () {};

    urls(tweet.text,
         function (urls) {
             async.filter(urls,
                          function (item, callback) {
                              unshortener.expand(item, function (url) {
                                  callback(services.indexOf(
                                      url.host.replace('www.', '')));
                                  });
                          },
                          function (results) {
                              var url = results[0] || null;
                              callback(url);
                          });
         });
};

exports.extract_pic = function (link, callback) {
    callback = callback || function () {};

    var extractors = {};

    var extractor = extractors[urllib.parse(link).host] || general;
    extractor(link, callback);
};

function general(link, callback) {
    var iterator = function (url, callback) {
        url = urllib.parse(url);

        http.request({host: url.host,
                      port: 80,
                      path: url.pathname,
                      method: 'HEAD'},
                     function (res) {
                         var size = 0;
                         if (res.headers['content-length']) {
                             size = res.headers['content-length'];
                             res.connection.destroy();
                             callback(null, -size);
                         }else{
                             res.on('data', function (chunk) {
                                 size += chunk.length;
                             });
                             res.on('end', function () {
                                 callback(null, -size);
                             });
                         }
                     }).end();
    };


    jsdom.env(link, [
        'http://code.jquery.com/jquery-1.5.min.js'
    ], function(errors, window) {
        var $ = window.$;

        var candidates = [];

        $('img').each(function () {
            candidates.push(
                urllib.resolve(link, $(this).attr('src')));
        });

        async.sortBy(candidates,
                     iterator,
                     function (err, results) {
                         callback(results[0]);
                     });
    });
}
