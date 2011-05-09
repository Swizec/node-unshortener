
// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../app')
  , assert = require('assert');


module.exports = {
  'GET /': function(){
    assert.response(app,
      { url: '/' },
      { status: 302},
      function(res){
        //assert.includes(res.body, '<title>Express</title>');
      });
  }
};
