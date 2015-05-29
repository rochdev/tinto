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
  var forBrowser;
  var builder;
  var webdriver;
  var queue;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    queue = sinon.stub({process: function() {}, push: function() {}});
    webdriver = sinon.stub({Builder: function() {}});
    builder = sinon.stub({forBrowser: function() {}});
    forBrowser = sinon.stub({build: function() {}});
    driver = sinon.stub({
      get: function() {},
      close: function() {},
      executeScript: function() {},
      findElements: function() {},
      getCurrentUrl: function() {}
    });

    webdriver.Builder.returns(builder);
    builder.forBrowser.returns(forBrowser);
    forBrowser.build.returns(driver);
    queue.process.returns(Q.resolve());

    element = sinon.stub({
      getDriver: function() {},
      getAttribute: function() {}
    });

    element.getDriver.returns(driver);

    promise = Q.resolve(element);

    mockery.registerMock('selenium-webdriver', webdriver);

    evaluator = require('../../lib/utils/evaluator');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should open the driver', function() {
    evaluator.open();

    expect(forBrowser.build).to.have.been.called;
  });

  it('should return the driver', function() {
    evaluator.open();

    expect(evaluator.getDriver()).to.equal(driver);
  });

  it('should only open the driver if not already opened', function() {
    evaluator.open();
    evaluator.open();

    expect(forBrowser.build).to.have.been.calledOnce;
  });

  it('should close the driver', function() {
    evaluator.open();
    driver.close.returns(Q.resolve());

    return evaluator.close().then(function() {
      expect(driver.close).to.have.been.calledOn(driver);
    });
  });

  it('should do nothing when trying to close an unopened driver', function(done) {
    expect(function() {
      evaluator.close().then(done).done();
    }).not.to.throw();
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

  it('should be able to find descendants by selector string', function() {
    driver.findElements.withArgs(sinon.match({css: '#test'})).returns('elements');

    evaluator.open();

    return expect(evaluator.find('#test')).to.equal('elements');
  });
});
