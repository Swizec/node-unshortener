var unshortener = require('../lib/unshortener')
  , assert = require('assert');

var urllib = require('url');


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
    }
};
