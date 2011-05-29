var unshortener = require('../lib/unshortener')
  , assert = require('assert');

var urllib = require('url');

var unshort = unshortener.Unshorteners;

module.exports = {
    'test_unresolvable': function (beforeExit) {
        var fired = false;
        var fixture = 'http://this.shouldnt.resolve.at.all/234dfa3';

        unshortener.expand(fixture,
                           function (url, error) {
                               assert.equal(url.href, fixture);
                               assert.ok(error);
	                       fired = true;
        });

	beforeExit(function () {
	    assert.ok(fired);
	});
    },

    'test_bad_link': function (beforeExit) {
        var fired = false;
        var fixture = 'http://linkd.in/k2XhE3sfaawfaw3f';

        unshortener.expand(fixture,
                           function (url, error) {
                               assert.equal(url.href, fixture);
                               assert.ok(error);
	                       fired = true;
        });

	beforeExit(function () {
	    assert.ok(fired);
	});
    },

    'bad_bit.ly': function (beforeExit) {
	var fired = false;

        unshort.bitly(urllib.parse('http://bit.ly/k2XhE3sfaawfaw3f'),
                      // these exist for the sole purpose of testing node-unshortener
                      {'username': 'nodeunshortener',
                       'apikey': 'R_aafa12fe5f14836d39b016b04e0e3cd1'},
		      function (url) {
			  assert.equal(url.href,
				       'http://bit.ly/k2XhE3sfaawfaw3f');
			  fired = true;
		      });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    }
};
