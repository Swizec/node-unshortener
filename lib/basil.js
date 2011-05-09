
var async = require('async');
var urllib = require('url');

var urls = function (text, callback) {
    async.filter(text.split(' '),
                 function (item, callback) {
                     callback(item.substr(0, 7) === 'http://');
                 },
                 callback);
}

var services = ['instagr.am', 'yfrog.com', 'twitpic.com', 'picplz.com'];

exports.is_pic = function (tweet, callback) {
    callback = callback || function () {};

    urls(tweet.text,
         function (urls) {
             async.filter(urls,
                          function (item, callback) {
                              var service = urllib.parse(item).host.replace('www.', '');
                              callback(services.indexOf(service) > -1);
                          },
                          function (results) {
                              callback(results.length > 0);
                          });
         });
}
