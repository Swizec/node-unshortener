
var basil = require('../lib/basil')
  , assert = require('assert');

var tweets = JSON.parse(require('fs').readFileSync('./test/tweets.json'));

module.exports = {
    'is_pic': function () {
        for (var i=0; i<tweets.length; i++) {
            basil.is_pic(tweets[i]);
        }

        assert.ok(true);
    }
};

