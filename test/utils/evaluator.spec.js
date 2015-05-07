'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('evaluator', function() {
  var evaluator;
  var element;
  var promise;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    element = sinon.stub({
      getDriver: function() {}
    });

    promise = Q.resolve(element);

    evaluator = require('../../lib/utils/evaluator');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should execute a script on the client', function() {
    var driver = sinon.stub({
      executeScript: function() {}
    });

    element.getDriver.returns(driver);

    // TODO: find a way to test the callback context and arguments
    var evaluated = evaluator.execute(promise, function() {}).then(function() {
      var el = driver.executeScript.firstCall.args[1];
      var callback = driver.executeScript.firstCall.args[2];
      var args = driver.executeScript.firstCall.args[3];

      expect(driver.executeScript).to.have.been.called;

      driver.executeScript.firstCall.args[0](el, callback, args);
    });

    return evaluated;
  });
});
