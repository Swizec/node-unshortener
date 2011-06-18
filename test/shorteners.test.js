var unshortener = require('../lib/unshortener')
  , assert = require('assert');

var urllib = require('url');


var unshort = unshortener.Unshorteners;

module.exports = {
    'expand_bit.ly': function (beforeExit) {
	var fired = false;

        unshort.bitly(urllib.parse('http://bit.ly/lyQusq'),
                      // these exist for the sole purpose of testing node-unshortener
                      {'username': 'nodeunshortener',
                       'apikey': 'R_aafa12fe5f14836d39b016b04e0e3cd1'},
		      function (url) {
			  assert.equal(url.href,
				       'http://www.crunchgear.com/2011/05/18/review-two-speck-ipad-2-cases/?utm_source=twitterfeed&utm_medium=twitter');
			  fired = true;
		      });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    },

    'custom_bitly': function (beforeExit) {
        var urls = {'http://jc.is/mvVPJ2': 'http://news.ycombinator.com/item?id=2595226',
                    'http://ericri.es/kcfliN': 'http://su.pr/2uatZH',
                    'http://nyti.ms/k2SK7V': 'http://www.nytimes.com/2011/05/29/realestate/scenes-from-a-wild-youth-streetscapescentral-park.html?smid=tw-nytimes&seid=auto',
                    'http://linkd.in/k2XhE3': 'http://www.linkedin.com/pub/kristofer-marcus-pmp-csm/3/b4/32a',
                    'http://win.gs/mgJknF': 'http://www.youtube.com/watch?v=CHLtVhTaZjA',
		    'http://dai.ly/9QkUnD': 'http://www.dailymotion.com/video/x92auu_knackebrodsdansen-talang-2009-incro_fun',
		    'http://imgry.net/jqZsHU': 'http://davewilsonphotography.com/2011/06/03/hoodoos-of-bryce-canyon/?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed:+DaveWilsonPhotography+(Dave+Wilson+Photography)',
		    'http://mln.im/lglfGU': 'http://www.hongkiat.com/blog/useful-web-usability-testing-tools/',
		    'http://theatln.tc/izjqpV': 'http://www.theatlanticwire.com/national/2011/06/jack-kevorkian/38453/',
		    'http://rww.to/jZpbWa': 'http://www.readwriteweb.com/archives/belgian_museum_offers_real_guides_online.php?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed:+readwriteweb+(ReadWriteWeb)'};

        var a_case = function (fixture) {
            var fired = false;

            unshort.bitly(urllib.parse(fixture),
                          // these exist for the sole purpose of testing node-unshortener
                          {'username': 'nodeunshortener',
                           'apikey': 'R_aafa12fe5f14836d39b016b04e0e3cd1'},
		          function (url) {
			      assert.equal(url.href, urls[fixture]);
			      fired = true;
		          });

	    beforeExit(function () {
	        assert.equal(fired, true);
	    });
        };


        for (var fixture in urls) {
            a_case(fixture);
        };
    },

    'expand_j.mp': function (beforeExit) {
        var fired = false;

	unshort.bitly(urllib.parse('http://j.mp/m77DEe'),
                      {'username': 'nodeunshortener',
                       'apikey': 'R_aafa12fe5f14836d39b016b04e0e3cd1'},
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
    },

    'expand_goo.gl': function (beforeExit) {
        var fired = false;

	unshort.googl(urllib.parse('http://goo.gl/fbsS'),
		      function (url) {
			  assert.equal(url.href,
				       'http://www.google.com/');
			  fired = true;
		      });

	beforeExit(function () {
	    assert.equal(fired, true);
	});
    },

    'expand_budurl.com': function (beforeExit) {
        var fired = false;

        unshort.budurl(urllib.parse('http://budurl.com/6a8k'),
                       function (url) {
                           fired = true;
                           assert.equal(url.href,
                                        'http://www.charlestonparksconservancy.org/blogs/view_article/packing_a_picnic/?utm_source=twitter&utm_medium=twitter&utm_campaign=packingapicnic');
                       });

        beforeExit(function () {
            assert.equal(fired, true);
        });
    },

    'expand_cli.gs': function (beforeExit) {
        var fired = false;

        unshort.cligs(urllib.parse('http://cli.gs/gIBpf'),
                       function (url) {
                           fired = true;
                           assert.equal(url.href,
                                        'http://twitter.com/ryanlavia/statuses/82073752527044608');
                       });

        beforeExit(function () {
            assert.equal(fired, true);
        });
    },

    'expand_snipurl.com': function (beforeExit) {
        var fired = false;

        unshort.snipurl(urllib.parse('http://snipurl.com/27x8i0'),
                       function (url) {
                           fired = true;
                           assert.equal(url.href,
                                        'http://www.wishbookweb.com/1940_Sears_ChristmasBook/images/1940SearsChristmasBookPage0037.jpg');
                       });


        var urls = {'http://snipurl.com/27x8i0': 'http://www.wishbookweb.com/1940_Sears_ChristmasBook/images/1940SearsChristmasBookPage0037.jpg',
                   'http://snurl.com/1esgm9': 'http://granburywx.net/',
                   'http://cl.lk/8jqkq': 'http://www.nytimes.com/2011/06/11/opinion/11brenner.html?_r=1',
                   'http://snipr.com/39gmp': 'http://www.amazon.com/dp/0439545277/ref=nosim/?tag=kidderlit-20',
                   'http://sn.im/financefam': 'http://fiscalfamily.com/'};

        var a_case = function (fixture) {
            var fired = false;

            unshort.snipurl(urllib.parse(fixture),
                            function (url) {
			        assert.equal(url.href, urls[fixture]);
			        fired = true;
		            });

	    beforeExit(function () {
	        assert.equal(fired, true);
	    });
        };

        for (var fixture in urls) {
            a_case(fixture);
        };
    }
}
