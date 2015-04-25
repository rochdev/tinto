'use strict';

var sinonChai = require('sinon-chai');
var expect = require('chai').use(sinonChai).expect;
var getters = require('../../lib/utils/getters');

describe('getters', function() {
  var source;
  var destination;

  beforeEach(function() {
    source = {
      get test() {
        return this.hello;
      }
    };

    destination = {
      hello: 'world'
    };
  });

  it('should assign properties from source to destination', function() {
    getters(destination, source);

    expect(destination.test).to.be.defined;
    expect(destination.test).to.equal('world');
  });

  it('should return the newly defined properties', function() {
    var props = getters(destination, source);

    expect(props).to.deep.equal(['test']);
  });
});
