
# node-unshortener 0.0.3

A simple library that can unshorten any short url.

## Install

     npm install unshortener

or

     git clone https://github.com/Swizec/node-unshortener.git
     cd node-unshortener
     npm link

## Usage

     // expand an URL
     var unshortener = require('unshortener');

     // you can pass in a url object or string
     unshortener.expand('http://t.co/rWP6BP3',
                        function (url) {
                             // url is a url object
                             console.log(url);
                        });

If you have a handy bitly account you should also pass in an options
object to enable the unshortener to use the bitly API directly:

     // expand an URL
     var unshortener = require('unshortener');

     // you can pass in a url object or string
     unshortener.expand('http://t.co/rWP6BP3',
                        {bitly: {username: '<YOUR BITLY USERNAME>',
                                 apikey: '<YOUR BITLY API KEY>'}},
                        function (url) {
                             // url is a url object
                             console.log(url);
                        });

One final warning about bitly; as of this writing node-bitly as it
sits in the npm repository is broken and you should install from git
directly despite the fact both versions are 1.0.1.

## How it works

node-unshortener aims to be able to unshorten any link possible, so it
tries to behave as a browser and simply follows all the
redirects. However, to be nice, when at all possible, it tries to use
the url shortener's official API.

That said, please feel free to suggest any unshortening services I may
have missed.

Services directly supported so far:

  - bit.ly
  - j.mp
  - is.gd


