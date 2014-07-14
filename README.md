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

### Errors

When an error occurs, the callback is passed an Error object (with
`statusCode` if an HTTP error, and/or `code` if there was an internal
error) along with the URL which resulted in the error. Note that this
may not be the original url passed into the unshortener. For example,
if you pass in a URL that returns a 301 redirect to a new URL, and that
new URL results in a 500 error, that new URL will be passed to the
callback along with the error.

This behavior is helpful because sometimes the unshortener receives an
error on an otherwise successfully-unshortened URL, for example if the
server responds to HEAD requests with 404s, or doesn't like the chosen
user agent, or otherwise attempts to trip up crawlers. It is up to the
client to decide how to interpret these errors.

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
