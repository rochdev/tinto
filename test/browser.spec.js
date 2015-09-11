'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var expect = require('chai').use(sinonChai).use(chaiAsPromised).expect;
var rewire = require('rewire');
var Q = require('q');
var Browser = rewire('../lib/browser');

describe('Browser', function() {
  var Page;
  var Entity;
  var browser;
  var driver;
  var evaluator;
  var queue;
  var find;

  beforeEach(function() {
    driver = sinon.stub({
      get: function() {},
      getCurrentUrl: function() {},
      navigate: function() {}
    });

    queue = sinon.stub({process: function() {}, push: function() {}, clear: function() {}});
    queue.process.returns(Q.resolve());

    evaluator = sinon.stub({
      open: function() {},
      close: function() {},
      getDriver: function() {}
    });
    evaluator.getDriver.returns(driver);

    Page = sinon.spy();
    Entity = require('../lib/entity');
    sinon.spy(Entity.prototype, 'property');

    find = sinon.stub().withArgs('title').returns({
      first: sinon.stub().returns({
        getText: sinon.stub().returns('test')
      })
    });

    Browser.__set__('Entity', Entity);
    Browser.__set__('evaluator', evaluator);
    Browser.__set__('queue', queue);
    Browser.__set__('Page', Page);
    Browser.__set__('find', find);

    browser = new Browser();
  });

  afterEach(function() {
    Entity.prototype.property.restore();
  });

  it('should be an entity', function() {
    expect(browser).to.be.instanceof(Entity);
  });

  it('should open the evaluator', function() {
    browser.open();

    expect(evaluator.open).to.have.been.called;
  });

  it('should open the evaluator and visit the URL', function() {
    browser.open('test.com');

    queue.push.firstCall.args[0]();

    expect(evaluator.open).to.have.been.called;
    expect(driver.get).to.have.been.calledWith('test.com');
  });

  it('should visit the URL', function() {
    driver.get.withArgs('test.com').returns('test');

    browser.open();
    browser.visit('test.com');

    var result = queue.push.firstCall.args[0]();

    expect(driver.get).to.have.been.calledWith('test.com');
    expect(result).to.equal('test');
  });

  it('should navigate', function() {
    driver.navigate.returns('test');

    browser.open();

    expect(browser.navigate).to.equal('test');
  });

  it('should close the evaluator', function() {
    browser.open();
    evaluator.close.returns(Q.resolve());
    queue.push.reset();

    browser.close();

    expect(queue.push).to.have.been.called;

    queue.push.firstCall.args[0]();

    expect(evaluator.close).to.have.been.calledOn(evaluator);
  });

  it('should force close the evaluator', function() {
    browser.open();
    evaluator.close.returns(Q.resolve());

    browser.close(true);

    expect(queue.process).not.to.have.been.called;
    expect(queue.clear).to.have.been.called;
    expect(evaluator.close).to.have.been.called;
  });

  it('should get its page', function() {
    browser.open();

    var page = browser.getPage();

    expect(page).to.be.instanceof(Page);
    expect(Page).to.have.been.called;
    expect(Page.firstCall.args[0]).to.have.property('parent', undefined);
    expect(Page.firstCall.args[0]).to.have.property('selector', 'html');
    expect(Page.firstCall.args[0]).to.have.property('index', 0);
  });

  it('should have URL property', function() {
    browser.open();
    driver.getCurrentUrl.returns(Q.resolve('test.com'));

    return expect(browser.url.value).to.eventually.equal('test.com');
  });

  it('should have title property', function() {
    expect(browser.title.value).to.equal('test');
  });
});
