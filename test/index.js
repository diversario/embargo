var embargo = require('../');

// override value is what fake module .exports
embargo['node_mod'] = {
  'getValue': function () {
    return 'Fake node_mod';
  }
};


var mod1 = require('./lib/mod1/mod1')
  , assert = require('assert')
;


describe('Exports of mod1', function() {
  it('should equal to exports of node_mod', function(done){
    assert.equal(mod1(), 'Fake node_mod');
    done();
  })
});