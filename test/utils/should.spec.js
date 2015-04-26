'use strict';

var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = require('chai').use(sinonChai).expect;
var should = rewire('../../lib/utils/should');

describe('should', function() {
  var descriptors;
  var context;
  var chai;

  beforeEach(function() {
    chai = sinon.stub({
      expect: function() {}
    });

    chai.Assertion = sinon.spy(function() {
      this.__flags = 'flags';
    });

    descriptors = sinon.stub();
    descriptors.withArgs(chai.Assertion.prototype).returns({
      foo: {
        value: 'bar'
      },
      hello: {
        value: 'world'
      }
    });

    should.__set__('chai', chai);
    should.__set__('descriptors', descriptors);
  });

  it('should contain registered assertions', function() {
    expect(should()).to.have.property('foo', 'bar');
  });

  it('should contain assertion flags', function() {
    expect(should()).to.have.property('__flags', 'flags');
  });

  it('should not overwrite its own values when asserting', function() {
    Function.prototype.hello = 'test';

    expect(should()).to.have.property('hello', 'test');
  });

  it('should assert multiple delegated assertions', function() {
    var firstAssertion = sinon.spy();
    var secondAssertion = sinon.spy();

    should.call(context)(firstAssertion, secondAssertion);

    expect(firstAssertion).to.have.been.calledWithMatch();
    expect(firstAssertion.firstCall.args[0]).to.equal(context);
    expect(secondAssertion).to.have.been.called;
    expect(secondAssertion.firstCall.args[0]).to.equal(context);
  });
});
