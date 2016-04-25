'use strict';

var Q = require('q');
var sinon = require('sinon');
var Attribute = require('../lib/attribute');
var expect = require('chai').expect;

describe('Attribute', function() {
  var component;
  var name;
  var value;
  var attribute;

  beforeEach(function() {
    component = {
      toString: sinon.stub()
    };
    component.toString.returns('[Component:uuid]');

    name = 'test';
  });

  it('should have the correct string representation', function() {
    attribute = new Attribute(component, name, value);

    expect(attribute.toString()).to.equal('property test of [Component:uuid]');
  });

  describe('given a primitive value', function() {
    beforeEach(function() {
      value = function() {return Q.resolve('test');};
      attribute = new Attribute(component, name, value);
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
      return attribute.contains('es')().then(function(results) {
        expect(results[0].outcome).to.be.true;
        expect(results[0].expected).to.equal('es');
      });
    });

    it('should assert to false for containing when actual does not contain expected', function() {
      return attribute.contains('foo')().then(function(results) {
        expect(results[0].outcome).to.be.false;
        expect(results[0].expected).to.equal('foo');
      });
    });
  });

  describe('given multiple primitive values', function() {
    beforeEach(function() {
      value = function() {return Q.resolve('test');};
      attribute = new Attribute(component, name, value);
    });

    it('should assert to true for containing when actual contains all expected', function() {
      return attribute.contains('te', 'st')().then(function(results) {
        expect(results[0].outcome).to.be.true;
        expect(results[0].expected).to.equal('te');
        expect(results[1].outcome).to.be.true;
        expect(results[1].expected).to.equal('st');
      });
    });

    it('should assert to false for containing when actual does not contain all expected', function() {
      return attribute.contains('foo', 'bar')().then(function(results) {
        expect(results[0].outcome).to.be.false;
        expect(results[0].expected).to.equal('foo');
        expect(results[1].outcome).to.be.false;
        expect(results[1].expected).to.equal('bar');
      });
    });
  });

  describe('given an array', function() {
    beforeEach(function() {
      value = function() {return Q.resolve(['foo', 'bar']);};
      attribute = new Attribute(component, name, value);
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
      return attribute.contains('foo', 'bar')().then(function(results) {
        expect(results[0].outcome).to.be.true;
        expect(results[0].expected).to.equal('foo');
        expect(results[1].outcome).to.be.true;
        expect(results[1].expected).to.equal('bar');
      });
    });

    it('should assert to false for containing when actual does not contain expected', function() {
      return attribute.contains('baz', 'qux')().then(function(results) {
        expect(results[0].outcome).to.be.false;
        expect(results[0].expected).to.equal('baz');
        expect(results[1].outcome).to.be.false;
        expect(results[1].expected).to.equal('qux');
      });
    });
  });
});
