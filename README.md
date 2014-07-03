# node-unshortener 0.1.0

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
                        function (err, url) {
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
                        function (err, url) {
                             // url is a url object
                             console.log(url);
                        });
```

When an error occurs the callback is passed the original url and an
error flag.

### Options

The second parameter may be an `options` object. The options are:

  - `bitly` - Object containing bitly `username` and `apikey`.
  - `googl` - API key for googleapis unshortener.
  - `userAgent` - Custom user agent to use. The default is
  `AppleWebKit/525.13 (KHTML, like Gecko) Safari/525.13.`. No user
  agent header is sent to `t.co` shortened links.
  - `proxy` - Proxy to be passed on to `request` module defaults.
  - `recurseAfterAPICall` - When set to true, after requesting an
  unshortened URL via any applicable API (bitly, etc.), the unshortener
  will use its generic unshortening method on the received URL to check
  for any further redirects or errors. This handles the edge-case where
  a shortened URL unfurls to another shortened URL. Defaults to false.

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

MIT
