'use strict';

var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var Assertable = rewire('../lib/assertable');
var expect = require('chai').use(sinonChai).expect;

describe('Assertable', function() {
  var bundles;
  var chai;

  beforeEach(function() {
    bundles = [];
    chai = sinon.stub({
      expect: function() {}
    });

    Assertable.__set__('bundles', bundles);
    Assertable.__set__('chai', chai);
  });

  it('should store and execute a supported state', function() {
    var assertable = new Assertable();
    var test = sinon.spy(function() {
      return true;
    });

    assertable.supportState('test', test);

    return assertable.is('test')().then(function(result) {
      expect(result).to.be.true;
      expect(test.thisValues[0]).to.equal(assertable);
    });
  });

  it('should store and execute a supported property', function() {
    var assertable = new Assertable();
    var test = sinon.spy(function(value) {
      return value === 'a value';
    });

    assertable.supportProperty('test', test);

    return assertable.has('test', 'a value')().then(function(result) {
      expect(result).to.be.true;
      expect(test.thisValues[0]).to.equal(assertable);
    });
  });

  it('should store and execute supported states', function() {
    var assertable = new Assertable();

    assertable.supportStates({
      first: function() {
        return true;
      },
      second: function() {
        return false;
      }
    });

    var isFirst = assertable.is('first')();
    var isSecond = assertable.is('second')();

    return Q.all([isFirst, isSecond]).then(function(results) {
      expect(results[0]).to.be.true;
      expect(results[1]).to.be.false;
    });
  });

  it('should store and execute supported properties', function() {
    var assertable = new Assertable();

    assertable.supportProperties({
      first: function(value) {
        return value === 'first value';
      },
      second: function(value) {
        return value === 'second value';
      }
    });

    var hasFirst = assertable.has('first', 'first value')();
    var hasSecond = assertable.has('second', 'second value')();

    return Q.all([hasFirst, hasSecond]).then(function(results) {
      expect(results[0]).to.be.true;
      expect(results[1]).to.be.true;
    });
  });

  it('should support states from a bundle', function() {
    var assertable = new Assertable();
    var test = sinon.spy(function() {
      return true;
    });

    bundles.push({
      states: {
        test: test
      }
    });

    assertable.supportState('test');

    return assertable.is('test')().then(function(result) {
      expect(result).to.be.true;
      expect(test.thisValues[0]).to.equal(assertable);
    });
  });

  it('should support properties from a bundle', function() {
    var assertable = new Assertable();
    var test = sinon.spy(function(value) {
      return value === 'a value';
    });

    bundles.push({
      properties: {
        test: test
      }
    });

    assertable.supportProperty('test');

    return assertable.has('test', 'a value')().then(function(result) {
      expect(result).to.be.true;
      expect(test.thisValues[0]).to.equal(assertable);
    });
  });

  it('should throw an error when trying to register a state that does not exist', function() {
    var assertable = new Assertable();

    bundles.push({states: {}});

    expect(function() {
      assertable.supportState('test');
    }).to.throw('State "test" does not exist');
  });

  it('should throw an error when trying to register a property that does not exist', function() {
    var assertable = new Assertable();

    bundles.push({properties: {}});

    expect(function() {
      assertable.supportProperty('test');
    }).to.throw('Property "test" does not exist');
  });

  it('should throw an error when trying to use a state that does not exist', function() {
    var assertable = new Assertable();

    expect(function() {
      assertable.is('test')();
    }).to.throw('Unsupported state "test"');
  });

  it('should throw an error when trying to use a property that does not exist', function() {
    var assertable = new Assertable();

    expect(function() {
      assertable.has('test', 'first value')();
    }).to.throw('Unsupported property "test"');
  });

  it('should delegate assertions', function() {
    var assertable = new Assertable();

    assertable.should;

    expect(chai.expect).to.have.been.calledWith(assertable);
  });
});
