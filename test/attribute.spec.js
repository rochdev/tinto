'use strict';

var Q = require('q');
var Attribute = require('../lib/attribute');
var expect = require('chai').expect;

describe('Attribute', function() {
  var promise;
  var attribute;

  describe('given a primitive value', function() {
    beforeEach(function() {
      promise = Q.resolve('test');
      attribute = new Attribute(promise);
    });

    it('should assert to true for equality when actual and expected values match', function() {
      return attribute.equals('test')().then(function(result) {
        expect(result.outcome).to.be.true;
        expect(result.expected).to.equal('test');
        expect(result.actual).to.equal('test');
      });
    });

    it('should assert to false for equality when actual and expected values differ', function() {
      return attribute.equals('foo')().then(function(result) {
        expect(result.outcome).to.be.false;
        expect(result.expected).to.equal('foo');
        expect(result.actual).to.equal('test');
      });
    });

    it('should assert to true for containing when actual contains expected', function() {
      return attribute.contains('es')().then(function(result) {
        expect(result.outcome).to.be.true;
        expect(result.expected).to.equal('es');
      });
    });

    it('should assert to false for containing when actual does not contain expected', function() {
      return attribute.contains('foo')().then(function(result) {
        expect(result.outcome).to.be.false;
        expect(result.expected).to.equal('foo');
      });
    });
  });

  describe('given an array', function() {
    beforeEach(function() {
      promise = Q.resolve(['foo', 'bar']);
      attribute = new Attribute(promise);
    });

    it('should assert to true for equality when actual and expected values match', function() {
      return attribute.equals(['foo', 'bar'])().then(function(result) {
        expect(result.outcome).to.be.true;
        expect(result.expected).to.deep.equal(['foo', 'bar']);
        expect(result.actual).to.deep.equal(['foo', 'bar']);
      });
    });

    it('should assert to false for equality when actual and expected values differ', function() {
      return attribute.equals(['baz'])().then(function(result) {
        expect(result.outcome).to.be.false;
        expect(result.expected).to.deep.equal(['baz']);
        expect(result.actual).to.deep.equal(['foo', 'bar']);
      });
    });

    it('should assert to true for containing when actual contains expected', function() {
      return attribute.contains('foo')().then(function(result) {
        expect(result.outcome).to.be.true;
        expect(result.expected).to.equal('foo');
      });
    });

    it('should assert to false for containing when actual does not contain expected', function() {
      return attribute.contains('baz')().then(function(result) {
        expect(result.outcome).to.be.false;
        expect(result.expected).to.equal('baz');
      });
    });
  });
});
