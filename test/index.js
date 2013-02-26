var embargo = require('../');

// override value is what fake module .exports
embargo('node_mod', {
  'getValue': function () {
    return 'Fake node_mod';
  }
});

embargo('relative_mod', {
  'getValue': function () {
    return 'Fake relative_mod';
  }
});

var mod1 = require('./lib/mod1/mod1')
  , mod2 = require('./lib/mod2/mod2')
  , mod3 = require('./lib/mod3/mod3')
  , assert = require('assert')
;


describe('Exports of mod1', function() {
  it('should equal to exports of node_mod', function(done){
    assert.equal(mod1(), 'Fake node_mod');
    done();
  })
});


describe('Exports of mod2', function() {
  it('should not equal to exports of relative_mod', function(done){
    assert.equal(mod2(), 'Fake relative_mod');
    done();
  })
});


describe('Exports of mod3', function() {
  it('should not equal to exports of dir/relative_mod', function(done){
    assert.equal(mod3(), 'Fake relative_mod');
    done();
  })
});



describe('Exports of cached mod', function () {
  var cached_mod = require('cached_mod');
  
  it('return real content', function () {
    assert(/real cached/i.test(cached_mod.getValue()));
  });
  
  it('returns stubbed content', function () {
    embargo('cached_mod', {
      'getValue': function () {
        return 'fake cached_mod';
      }
    });

    var cached_mod = require('cached_mod');
    
    assert(/fake cached/i.test(cached_mod.getValue()));
  });
});