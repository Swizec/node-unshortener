var unshortener = require('../lib/unshortener')
  , assert = require('assert');

var urllib = require('url');


var unshort = unshortener.Unshorteners;

module.exports = {
    'expand_string': function (beforeExit) {
	var fired = false;

        unshortener.expand('http://is.gd/E27w2x', function (err, url) {
            assert.equal(url.href,
			 'http://holykaw.alltop.com/why-sleep-may-be-the-best-tool-for-tough-deci?tu3=1');
	    fired = true;
        });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    },

    'expand_object': function (beforeExit) {
        var fired = false;

        unshortener.expand(urllib.parse('http://fb.me/w9ajW3sD'),
                           function (err, url) {
                               assert.equal(url.href,
					    'http://www.njuz.net/stavljanje-smajlija-ponistava-sve-napisane-uvrede/');
			       fired = true;
                           });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    },

    'passes_options_on': function (beforeExit) {
        var fired = false;

        unshortener.expand('http://bit.ly/lyQusq',
                           // these exist for the sole purpose of testing node-unshortener
                          {bitly:{'username': 'nodeunshortener',
                                  'apikey': 'R_aafa12fe5f14836d39b016b04e0e3cd1'}},
		           function (err, url) {
			       assert.equal(url.href,
				            'http://www.crunchgear.com/2011/05/18/review-two-speck-ipad-2-cases/?utm_source=twitterfeed&utm_medium=twitter');
			       fired = true;
		           });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    },

    'works_without_options': function (beforeExit) {
        var fired = false;

        unshortener.expand('http://bit.ly/lyQusq',
		           function (err, url) {
			       assert.equal(url.href,
				            'http://techcrunch.com/2011/05/18/review-two-speck-ipad-2-cases/?utm_source=twitterfeed&utm_medium=twitter');
			       fired = true;
		           });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    },

    'expand_https': function (beforeExit) {
        var fired = false;

        unshortener.expand('https://youtu.be/UthUv3Njy08',
		           function (err, url) {
			       assert.equal(url.href,
				            'http://www.youtube.com/watch?v=UthUv3Njy08&feature=youtu.be');
			       fired = true;
		           });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    },

    'long_url': function (beforeExit) {
	var fired = false;

        unshortener.expand('http://news.ycombinator.com/item?id=2615987',
		           function (err, url) {
			       assert.equal(url.href,
				            'http://news.ycombinator.com/item?id=2615987');
			       fired = true;
		           });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    }
};
