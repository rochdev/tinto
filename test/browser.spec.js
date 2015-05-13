'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = require('chai').use(sinonChai).expect;
var rewire = require('rewire');
var Q = require('q');
var Browser = rewire('../lib/browser');

describe('Browser', function() {
  var Component;
  var ComponentCollection;
  var browser;
  var webdriver;
  var builder;
  var forBrowser;
  var driver;
  var queue;
  var evaluator;

  beforeEach(function() {
    queue = sinon.stub({process: function() {}, push: function() {}});
    webdriver = sinon.stub({Builder: function() {}});
    builder = sinon.stub({forBrowser: function() {}});
    forBrowser = sinon.stub({build: function() {}});
    driver = sinon.stub({
      get: function() {},
      close: function() {},
      findElement: function() {}
    });

    webdriver.Builder.returns(builder);
    builder.forBrowser.returns(forBrowser);
    forBrowser.build.returns(driver);
    queue.process.returns(Q.resolve());

    evaluator = sinon.stub({find: function() {}});
    evaluator.find.returns('elements');

    Component = sinon.spy();
    ComponentCollection = sinon.spy();

    Browser.__set__('webdriver', webdriver);
    Browser.__set__('queue', queue);
    Browser.__set__('evaluator', evaluator);
    Browser.__set__('Component', Component);
    Browser.__set__('ComponentCollection', ComponentCollection);

    browser = new Browser();
  });

  it('should open the driver and visit the URL', function() {
    browser.open('test.com');

    expect(forBrowser.build).to.have.been.called;
    expect(driver.get).to.have.been.calledWith('test.com');
  });

  it('should only open the driver if not already opened', function() {
    browser.open('test.com');
    browser.open('test.com');

    expect(forBrowser.build).to.have.been.calledOnce;
  });

  it('should add opening the driver to the queue', function() {
    var promise = browser.open('test.com');

    expect(queue.push).to.have.been.calledWith(promise);
  });

  it('should close the driver', function() {
    browser.open();
    driver.close.returns(Q.resolve());

    return browser.close().then(function() {
      expect(queue.process).to.have.been.called;
      expect(driver.close).to.have.been.called;
    });
  });

  it('should force close the driver', function() {
    browser.open();
    driver.close.returns(Q.resolve());

    return browser.close(true).then(function() {
      expect(queue.process).not.to.have.been.called;
      expect(driver.close).to.have.been.called;
    });
  });

  it('should do nothing when trying to close an unopened driver', function(done) {
    expect(function() {
      browser.close().then(done).done();
    }).not.to.throw();
  });

  it('should find components', function() {
    var element = {};

    browser.open();
    driver.findElement.returns(element);

    var components = browser.find('test');

    expect(driver.findElement).to.have.been.calledWithMatch({css: 'html'});
    expect(components).to.be.instanceof(ComponentCollection);
    expect(ComponentCollection).to.have.been.calledWith(Component, 'elements');
    expect(evaluator.find).to.have.been.calledWith(element, 'test');
  });
});
