'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = require('chai').use(sinonChai).expect;
var inherits = require('../../lib/utils/inherits');

describe('extend', function() {
  var Parent;
  var Child;

  beforeEach(function() {
    Parent = sinon.spy();
    Child = sinon.spy();
  });

  it('should inherit the child from its parent', function() {
    Parent.prototype.member = 'member';
    Parent.prototype.method = function() {};
    Parent.staticMember = 'static member';
    Parent.staticMethod = function() {};

    inherits(Child, Parent);

    expect(Child.prototype.member).to.equal(Parent.prototype.member);
    expect(Child.prototype.method).to.equal(Parent.prototype.method);
    expect(Child.staticMember).to.equal(Parent.staticMember);
    expect(Child.staticMethod).to.equal(Parent.staticMethod);

    var child = new Child();

    expect(child).to.be.instanceof(Parent);
  });

  it('should allow a null super class', function() {
    expect(function() {
      inherits(Child, null);
    }).not.to.throw();
  });

  it('should throw an error if the super class is not a function or null', function() {
    expect(function() {
      inherits(Child, 'test');
    }).to.throw();
  });
});
