'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var rewire = require('rewire');
var expect = require('chai').use(sinonChai).expect;
var extend = rewire('../../lib/utils/extend');

describe('extend', function() {
  var getters;
  var Parent;

  beforeEach(function() {
    Parent = sinon.spy();
    Parent.extend = extend;

    getters = sinon.spy();
    extend.__set__('getters', getters);
  });

  it('should inherit the child from its parent', function() {
    Parent.prototype.member = 'member';
    Parent.prototype.method = function() {};
    Parent.staticMember = 'static member';
    Parent.staticMethod = function() {};

    var Child = Parent.extend();

    expect(Child.prototype.member).to.equal(Parent.prototype.member);
    expect(Child.prototype.method).to.equal(Parent.prototype.method);
    expect(Child.staticMember).to.equal(Parent.staticMember);
    expect(Child.staticMethod).to.equal(Parent.staticMethod);

    var child = new Child();

    expect(child).to.be.instanceof(Parent);
  });

  it('should assign prototype properties from options', function() {
    var protoProps = {};
    var Child = Parent.extend(protoProps);

    expect(getters).to.have.been.calledWith(Child.prototype, protoProps);
  });

  it('should assign static properties from options', function() {
    var childMethod = function() {};
    var Child = Parent.extend(null, {
      childMethod: childMethod
    });

    expect(Child.childMethod).to.equal(childMethod);
  });

  it('should call the parent constructor by default', function() {
    var Child = Parent.extend();

    new Child();

    expect(Parent).to.have.been.called;
  });

  it('should override the parent constructor', function() {
    var ctor = sinon.spy();
    var Child = Parent.extend({
      constructor: ctor
    });

    new Child();

    expect(ctor).to.have.been.called;
  });
});
