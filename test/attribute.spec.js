'use strict';

var rewire = require('rewire');
//var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var Attribute = rewire('../lib/attribute');
var expect = require('chai').use(sinonChai).expect;

describe('Attribute', function() {
  var promise;
  var value;
  var attribute;

  beforeEach(function() {
    value = 'test';

    promise = Q.resolve(value);

    attribute = new Attribute(promise);
  });

  it('should assert to true for equality when actual and expected values match', function() {
    return attribute.equals('test')().then(function(result) {
      expect(result[0]).to.be.true;
      expect(result[1]).to.equal('test');
    });
  });

  it('should assert to false for equality when actual and expected values differ', function() {
    return attribute.equals('foo')().then(function(result) {
      expect(result[0]).to.be.false;
      expect(result[1]).to.equal('test');
    });
  });

  it('should assert to true for containing when actual contains expected', function() {
    return attribute.contains('es')().then(function(result) {
      expect(result[0]).to.be.true;
      expect(result[1]).to.equal('test');
    });
  });

  it('should assert to false for containing when actual does not contain expected', function() {
    return attribute.contains('foo')().then(function(result) {
      expect(result[0]).to.be.false;
      expect(result[1]).to.equal('test');
    });
  });
});
