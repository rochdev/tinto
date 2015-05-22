'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = require('chai').use(sinonChai).expect;
var rewire = require('rewire');
var Q = require('q');
var Browser = rewire('../lib/browser');

describe('Browser', function() {
  var Page;
  var Entity;
  var AssertionResult;
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
      findElement: function() {},
      getCurrentUrl: function() {}
    });

    webdriver.Builder.returns(builder);
    builder.forBrowser.returns(forBrowser);
    forBrowser.build.returns(driver);
    queue.process.returns(Q.resolve());

    Page = sinon.spy();
    AssertionResult = require('../lib/assertion-result');

    Entity = require('../lib/entity');
    sinon.spy(Entity.prototype, 'property');

    Browser.__set__('Entity', Entity);
    Browser.__set__('webdriver', webdriver);
    Browser.__set__('queue', queue);
    Browser.__set__('Page', Page);

    browser = new Browser();
  });

  afterEach(function() {
    Entity.prototype.property.restore();
  });

  it('should be an entity', function() {
    expect(browser).to.be.instanceof(Entity);
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

  it('should get its page', function() {
    var element = {};

    browser.open();
    driver.findElement.returns(element);

    var page = browser.getPage();

    expect(page).to.be.instanceof(Page);
    expect(driver.findElement).to.have.been.calledWithMatch({css: 'html'});
    expect(Page).to.have.been.calledWith(element);
  });

  it('should have URL property', function() {
    browser.open();
    driver.getCurrentUrl.returns(Q.resolve('test.com'));

    return expect(browser.url.value).to.eventually.equal('test.com');
  });
});
