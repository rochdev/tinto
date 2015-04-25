'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = require('chai').use(sinonChai).expect;
var rewire = require('rewire');
var Q = require('q');
var Browser = rewire('../lib/browser');

describe('Browser', function() {
  var Component;
  var browser;
  var webdriver;
  var builder;
  var forBrowser;
  var driver;
  var queue;

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

    Component = sinon.spy();

    Browser.__set__('webdriver', webdriver);
    Browser.__set__('queue', queue);
    Browser.__set__('Component', Component);

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

    var component = browser.find('test');

    expect(driver.findElement).to.have.been.calledWithMatch({css: 'test'});
    expect(component).to.be.instanceof(Component);
    expect(Component).to.have.been.calledWith(element);
  });
});
