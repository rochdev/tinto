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
  var driver;
  var ElementNotFoundError;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    element = sinon.stub({
      getDriver: function() {},
      findElements: function() {},
      getAttribute: function() {}
    });

    promise = Q.resolve(element);

    ElementNotFoundError = require('../../lib/errors/element-not-found-error');
    evaluator = require('../../lib/utils/evaluator');

    driver = sinon.stub({
      executeScript: function() {}
    });

    element.getDriver.returns(driver);
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should execute a script on the client', function() {
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

  it('should be able to find descendants by locator function', function() {
    // TODO: refactor not to test implementation
    var locator = function() {};

    evaluator.execute = sinon.stub();
    evaluator.execute.returns('elements');

    var elements = evaluator.find(promise, locator);

    expect(evaluator.execute).to.have.been.calledWith(promise, locator);
    expect(elements).to.equal('elements');
  });

  it('should be able to find descendants by selector string', function() {
    element.findElements.withArgs(sinon.match({css: '#test'})).returns('elements');
    element.getAttribute.withArgs('data-tinto-id').returns(Q.resolve('uuid'));

    return evaluator.find(promise, '#test').then(function(elements) {
      expect(elements).to.equal('elements');
    });
  });

  it('should polyfill the :scope selector', function() {
    element.getAttribute.withArgs('data-tinto-id').returns(Q.resolve('uuid'));

    return evaluator.find(promise, ':scope > test').then(function() {
      expect(element.findElements).to.have.been.calledWithMatch({css: '[data-tinto-id="uuid"] > test'});
    });
  });

  it('should throw an error when executing on a missing element', function() {
    promise = Q.resolve();

    return expect(evaluator.execute(promise)).to.eventually.be.rejectedWith(ElementNotFoundError);
  });

  it('should throw an error when finding on a missing element', function() {
    promise = Q.resolve();

    return expect(evaluator.find(promise, 'missing')).to.eventually.be.rejectedWith(ElementNotFoundError);
  });
});
