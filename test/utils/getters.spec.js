'use strict';

var sinonChai = require('sinon-chai');
var expect = require('chai').use(sinonChai).expect;
var getters = require('../../lib/utils/getters');

describe('getters', function() {
  it('should assign properties from source to destination', function() {
    var source = {
      get test() {
        return this.hello;
      }
    };

    var destination = {
      hello: 'world'
    };

    getters(destination, source);

    expect(destination.test).to.be.defined;
    expect(destination.test).to.equal('world');
  });
});
