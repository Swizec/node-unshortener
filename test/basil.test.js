
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
    },

    'extract_twitpic': function () {
        assert.fail();
        var link = 'http://twitpic.com/4xha23';

        basil.extract_pic(link, function (url) {
            assert.strictEqual(url, 'http://s3.amazonaws.com/twitpic/photos/large/298098219.jpg?AWSAccessKeyId=AKIAJF3XCCKACR3QDMOA&Expires=1305403342&Signature=0D2bRI8%2F6%2FIoSZ41VX5OT5itRT8%3D');
        });
    },

    'extract_instagram': function () {
        var link = 'http://instagr.am/p/EQAYn/';

        basil.extract_pic(link, function (url) {
            assert.strictEqual(url, 'http://images.instagram.com/media/2011/05/14/e2edcce4a2724769920b4bd7cf7a4a38_7.jpg');
        });
    },

    'extract_random': function () {
        basil.extract_pic('http://swizec.com/blog/using-prime-numbers-to-generate-pretty-trees/swizec/1705',
                          function (url) {
                              console.log(url);
                          });
    }
};

