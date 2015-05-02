'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('flag', function() {
  var chai;
  var utils;
  var object;
  var flag;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    utils = sinon.stub({
      flag: function() {}
    });

    chai = {
      use: function(plugin) {
        plugin(chai, utils);
      }
    };

    object = {};

    mockery.registerMock('chai', chai);

    flag = require('../../lib/utils/flag');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should set a flag on an object', function() {
    flag(object, 'foo', 'bar');

    expect(utils.flag).to.have.been.calledWith(object, 'foo', 'bar');
  });

  it('should get a flag from an object', function() {
    utils.flag.withArgs(object, 'foo').returns('bar');

    var value = flag(object, 'foo');

    expect(value).to.equal('bar');
  });
});
