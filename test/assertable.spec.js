'use strict';

var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var Assertable = rewire('../lib/assertable');
var expect = require('chai').use(sinonChai).expect;

describe('Assertable', function() {
  var assertable;
  var bundles;
  var chai;

  beforeEach(function() {
    bundles = [];
    chai = sinon.stub({
      expect: function() {}
    });

    chai.Assertion = sinon.spy(function() {
      this.__flags = 'flags';
    });

    chai.Assertion.prototype.hello = 'world';

    Object.defineProperty(chai.Assertion.prototype, 'foo', {
      value: 'bar'
    });

    Assertable.__set__('bundles', bundles);
    Assertable.__set__('chai', chai);

    assertable = new Assertable();
  });

  it('should store and execute a supported state', function() {
    var test = sinon.spy(function() {
      return true;
    });

    assertable.state('test', test);

    return assertable.is('test')().then(function(result) {
      expect(result).to.be.true;
      expect(test.thisValues[0]).to.equal(assertable);
    });
  });

  it('should store and execute a supported property', function() {
    var test = sinon.spy(function() {
      return 'a value';
    });

    assertable.property('test', test);

    return assertable.has('test', 'a value')().then(function(result) {
      expect(result).to.be.true;
      expect(test.thisValues[0]).to.equal(assertable);
    });
  });

  it('should store and execute supported states', function() {
    assertable.states({
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
    assertable.properties({
      first: function() {
        return 'first value';
      },
      second: function() {
        return 'second value';
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
    var test = sinon.spy(function() {
      return true;
    });

    bundles.push({
      states: {
        test: test
      }
    });

    assertable.state('test');

    return assertable.is('test')().then(function(result) {
      expect(result).to.be.true;
      expect(test.thisValues[0]).to.equal(assertable);
    });
  });

  it('should support properties from a bundle', function() {
    var test = sinon.spy(function() {
      return 'a value';
    });

    bundles.push({
      properties: {
        test: test
      }
    });

    assertable.property('test');

    return assertable.has('test', 'a value')().then(function(result) {
      expect(result).to.be.true;
      expect(test.thisValues[0]).to.equal(assertable);
    });
  });

  it('should throw an error when trying to register a state that does not exist', function() {
    bundles.push({states: {}});

    expect(function() {
      assertable.state('test');
    }).to.throw('State "test" does not exist');
  });

  it('should throw an error when trying to register a property that does not exist', function() {
    bundles.push({properties: {}});

    expect(function() {
      assertable.property('test');
    }).to.throw('Property "test" does not exist');
  });

  it('should throw an error when trying to use a state that does not exist', function() {
    expect(function() {
      assertable.is('test')();
    }).to.throw('Unsupported state "test"');
  });

  it('should throw an error when trying to use a property that does not exist', function() {
    expect(function() {
      assertable.has('test', 'first value')();
    }).to.throw('Unsupported property "test"');
  });

  it('should contain registered assertions', function() {
    expect(assertable.should).to.have.property('foo', 'bar');
  });

  it('should contain assertion flags', function() {
    expect(assertable.should).to.have.property('__flags', 'flags');
  });

  it('should not overwrite its own values when asserting', function() {
    Function.prototype.hello = 'test';

    expect(assertable.should).to.have.property('hello', 'test');
  });

  it('should assert multiple delegated assertions', function() {
    var firstAssertion = sinon.spy();
    var secondAssertion = sinon.spy();

    assertable.should(firstAssertion, secondAssertion);

    expect(firstAssertion).to.have.been.calledWithMatch();
    expect(firstAssertion.firstCall.args[0]).to.be.instanceof(Assertable);
    expect(secondAssertion).to.have.been.called;
    expect(secondAssertion.firstCall.args[0]).to.be.instanceof(Assertable);
  });
});
