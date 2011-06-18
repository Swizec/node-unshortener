
# node-unshortener 0.0.8

A simple library that can unshorten any short url.

## Install

     npm install unshortener

or

     git clone https://github.com/Swizec/node-unshortener.git
     cd node-unshortener
     npm link

## Usage

``` javascript
     // expand an URL
     var unshortener = require('unshortener');

     // you can pass in a url object or string
     unshortener.expand('http://t.co/rWP6BP3',
                        function (url) {
                             // url is a url object
                             console.log(url);
                        });
```

If you have a handy bitly account you should also pass in an options
object to enable the unshortener to use the bitly API directly:

``` javascript
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
```

When an error occurs the callback is passed the original url and an
error flag.

## How it works

node-unshortener aims to be able to unshorten any link possible, so it
tries to behave as a browser and simply follows all the
redirects. However, to be nice, when at all possible, it tries to use
the url shortener's official API.

That said, please feel free to suggest any unshortening services I may
have missed.

Services/domains directly supported so far:

  - bit.ly
  - j.mp
  - is.gd
  - goo.gl
  - ericri.es
  - jc.is
  - nyti.ms
  - linkd.in
  - win.gs
  - budurl.com
  - cli.gs
  - snipurl.com
  - snurl.com
  - cl.lk
  - snipr.com
  - sn.im
  - dai.ly
  - imgry.net
  - mln.im
  - theatln.tc
  - rww.to

## License

Copyright (C) Swizec Teller <swizec@swizec.com>

Licensed under the [GPL version 3](http://www.gnu.org/licenses) or
later for non-commercial use.

For commercial use please consider [purchasing a commercial
license](http://www.binpress.com/app/nodeunshortener/414?ad=1031) to
support my work.
