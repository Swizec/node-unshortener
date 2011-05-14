
var basil = require('../lib/basil')
  , assert = require('assert');

var tweets = JSON.parse(require('fs').readFileSync('./test/tweets.json'));

module.exports = {
    'get_pic_link': function () {
        var services = /instagr.am|yfrog.com|twitpic.com|picplz.com/;

        for (var i=0; i<tweets.length; i++) {
            basil.get_pic_link(tweets[i], function (url) {
                assert.ok(url == null || url.match(services));
            });
        }
    }
};

