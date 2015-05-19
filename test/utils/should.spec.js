'use strict';

var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = require('chai').use(sinonChai).expect;
var should = rewire('../../lib/utils/should');

describe('should', function() {
  var mixin;
  var context;
  var chai;
  var flag;
  var descriptors;
  var CountAssertion;

  beforeEach(function() {
    flag = sinon.stub();

    chai = sinon.stub({
      expect: function() {}
    });

    chai.Assertion = sinon.spy(function() {
      this.__flags = 'flags';
    });

    context = sinon.stub();
    mixin = sinon.spy();
    descriptors = sinon.stub();

    CountAssertion = sinon.stub({register: function() {}});

    should.__set__('chai', chai);
    should.__set__('flag', flag);
    should.__set__('mixin', mixin);
    should.__set__('descriptors', descriptors);
    should.__set__('CountAssertion', CountAssertion);
  });

  it('should contain registered assertions', function() {
    var accessor = should();

    expect(mixin).to.have.been.calledWith(accessor, chai.Assertion.prototype);
  });

  it('should contain assertion flags', function() {
    expect(should()).to.have.property('__flags', 'flags');
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

  it('should create count assertions from getters', function() {
    descriptors.withArgs(context).returns({
      test: {
        get: function() {
          return 'test';
        }
      }
    });

    should.call(context);

    expect(CountAssertion.register).to.have.been.calledWith('test');
  });

  describe('eventually', function() {
    it('should contain registered assertions', function() {
      var accessor = should().eventually;

      expect(mixin).to.have.been.calledWith(accessor, chai.Assertion.prototype);
    });

    it('should contain assertion flags', function() {
      expect(should().eventually).to.have.property('__flags', 'flags');
    });

    it('should assert multiple delegated assertions', function() {
      var firstAssertion = sinon.spy();
      var secondAssertion = sinon.spy();

      should.call(context).eventually(firstAssertion, secondAssertion);

      expect(firstAssertion).to.have.been.calledWithMatch();
      expect(firstAssertion.firstCall.args[0]).to.equal(context);
      expect(secondAssertion).to.have.been.called;
      expect(secondAssertion.firstCall.args[0]).to.equal(context);
    });

    it('should contain the eventually flag', function() {
      var eventually = should().eventually;

      expect(flag).to.have.been.calledWith(eventually, 'eventually', true);
    });
  });
});
