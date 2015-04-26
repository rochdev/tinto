'use strict';

var Q = require('q');
var Attribute = require('../lib/attribute');
var expect = require('chai').expect;

describe('Attribute', function() {
  var promise;
  var value;
  var attribute;

  describe('given a primitive value"', function() {
    beforeEach(function() {
      value = 'test';

      promise = Q.resolve(value);

      attribute = new Attribute(promise);
    });

    it('should assert to true for equality when actual and expected values match', function() {
      return attribute.equals('test')().then(function(result) {
        expect(result.outcome).to.be.true;
        expect(result.actual).to.equal(value);
      });
    });

    it('should assert to false for equality when actual and expected values differ', function() {
      return attribute.equals('foo')().then(function(result) {
        expect(result.outcome).to.be.false;
        expect(result.actual).to.equal(value);
      });
    });

    it('should assert to true for containing when actual contains expected', function() {
      return attribute.contains('es')().then(function(result) {
        expect(result.outcome).to.be.true;
        expect(result.actual).to.equal(value);
      });
    });

    it('should assert to false for containing when actual does not contain expected', function() {
      return attribute.contains('foo')().then(function(result) {
        expect(result.outcome).to.be.false;
        expect(result.actual).to.equal(value);
      });
    });
  });

  describe('given an array', function() {
    beforeEach(function() {
      value = ['foo', 'bar'];

      promise = Q.resolve(value);

      attribute = new Attribute(promise);
    });

    it('should assert to true for equality when actual and expected values match', function() {
      return attribute.equals(['foo', 'bar'])().then(function(result) {
        expect(result.outcome).to.be.true;
        expect(result.actual).to.equal(value);
      });
    });

    it('should assert to false for equality when actual and expected values differ', function() {
      return attribute.equals(['baz'])().then(function(result) {
        expect(result.outcome).to.be.false;
        expect(result.actual).to.equal(value);
      });
    });

    it('should assert to true for containing when actual contains expected', function() {
      return attribute.contains('foo')().then(function(result) {
        expect(result.outcome).to.be.true;
        expect(result.actual).to.equal(value);
      });
    });

    it('should assert to false for containing when actual does not contain expected', function() {
      return attribute.contains('baz')().then(function(result) {
        expect(result.outcome).to.be.false;
        expect(result.actual).to.equal(value);
      });
    });
  });
});
