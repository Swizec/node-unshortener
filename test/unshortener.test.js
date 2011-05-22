var unshortener = require('../lib/unshortener')
  , assert = require('assert');

var urllib = require('url');


var unshort = unshortener.Unshorteners;

module.exports = {
    'expand_string': function (beforeExit) {
	var fired = false;

        unshortener.expand('http://is.gd/E27w2x', function (url) {
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

        unshortener.expand(urllib.parse('http://t.co/rWP6BP3'),
                           function (url) {
                               assert.equal(url.href,
					    'http://www.facebook.com/mybrucebruce');
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
                           {bitly: {'username': 'nodeunshortener',
                                    'apikey': 'R_aafa12fe5f14836d39b016b04e0e3cd1'}},
		           function (url) {
			       assert.equal(url.href,
				            'http://www.crunchgear.com/2011/05/18/review-two-speck-ipad-2-cases/?utm_source=twitterfeed&utm_medium=twitter');
			       fired = true;
		           });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    },

    'expand_bit.ly': function (beforeExit) {
	var fired = false;

        unshort.bitly(urllib.parse('http://bit.ly/lyQusq'),
                      // these exist for the sole purpose of testing node-unshortener
                      {bitly: {'username': 'nodeunshortener',
                               'apikey': 'R_aafa12fe5f14836d39b016b04e0e3cd1'}},
		      function (url) {
			  assert.equal(url.href,
				       'http://www.crunchgear.com/2011/05/18/review-two-speck-ipad-2-cases/?utm_source=twitterfeed&utm_medium=twitter');
			  fired = true;
		      });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    },

    'expand_j.mp': function (beforeExit) {
        var fired = false;

	unshort.bitly(urllib.parse('http://j.mp/m77DEe'),
                      {bitly: {'username': 'nodeunshortener',
                               'apikey': 'R_aafa12fe5f14836d39b016b04e0e3cd1'}},
		      function (url) {
			  assert.equal(url.href,
				       'https://dev.twitter.com/pages/application-permission-model');
			  fired = true;
		      });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    },

    'expand_is.gd': function (beforeExit) {
        var fired = false;

	unshort.isgd(urllib.parse('http://is.gd/JkYqPa'),
		     function (url) {
			 assert.equal(url.href,
				      'http://holykaw.alltop.com/the-inception-chair?tu3=1');
			 fired = true;
		     });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    }
};
