
# node-unshortener 0.0.4

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
  - goo.gl

## License

(The MIT License)

Copyright (c) 2010 TJ Holowaychuk <tj@vision-media.ca>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


