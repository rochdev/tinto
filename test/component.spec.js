'use strict';

var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var Assertable = sinon.spy(require('../lib/assertable'));
var Component = rewire('../lib/component');
var ComponentCollection = require('../lib/component-collection');
var expect = require('chai').use(sinonChai).expect;

describe('Component', function() {
  var queue;
  var extend;
  var getters;
  var element;
  var promise;
  var component;

  beforeEach(function() {
    queue = sinon.stub({
      push: function() {}
    });

    extend = sinon.spy(function() {return 'test';});
    getters = sinon.spy();

    Component.__set__('queue', queue);
    Component.__set__('extend', extend);
    Component.__set__('getters', getters);
  });

  beforeEach(function() {
    element = sinon.stub({
      findElements: function() {},
      getAttribute: function() {},
      getText: function() {},
      getDriver: function() {},
      click: function() {},
      sendKeys: function() {}
    });

    promise = Q.resolve(element);

    component = new Component(promise);
  });

  it('should inherit Assertable', function() {
    expect(component).to.be.instanceof(Assertable);
  });

  it('should be able to find sub-components', function() {
    var subComponents = component.find('#test');

    return promise.then(function() {
      expect(element.findElements).to.have.been.calledWithMatch({css: '#test'});
      expect(subComponents).to.be.instanceOf(ComponentCollection);
    });
  });

  it('should get its attributes', function() {
    element.getAttribute.withArgs('name').returns(Q.resolve('test'));

    var result = component.attr('name');

    return Q.all([promise, result]).then(function(results) {
      expect(element.getAttribute).to.have.been.calledWithMatch('name');
      expect(results[1]).to.equal('test');
    });
  });

  it('should get its text', function() {
    element.getText.returns(Q.resolve('test'));

    var result = component.text();

    return Q.all([promise, result]).then(function(results) {
      expect(element.getText).to.have.been.called;
      expect(results[1]).to.equal('test');
    });
  });

  it('should click on the component', function() {
    component.click();

    expect(queue.push).to.have.been.called;

    return queue.push.args[0][0]().then(function() {
      expect(element.click).to.have.been.called;
    });
  });

  it('should enter text on the component', function() {
    component.enter('test');

    expect(queue.push).to.have.been.called;

    return queue.push.args[0][0]().then(function() {
      expect(element.sendKeys).to.have.been.calledWith('test');
    });
  });

  it('should execute scripts', function() {
    var driver = sinon.stub({
      executeScript: function() {}
    });

    element.getDriver.returns(driver);

    // TODO: find a way to test the callback context and arguments
    return component.execute(function() {}).then(function() {
      var el = driver.executeScript.firstCall.args[1];
      var callback = driver.executeScript.firstCall.args[2];
      var args = driver.executeScript.firstCall.args[3];

      expect(driver.executeScript).to.have.been.called;

      driver.executeScript.firstCall.args[0](el, callback, args);
    });
  });

  // TODO: test return value and jQuery

  it('should delegate extend', function() {
    var protoProps = {};
    var staticProps = {};
    var test = Component.extend(protoProps, staticProps);

    expect(extend).to.have.been.calledWith(protoProps, staticProps);
    expect(test).to.equal('test');
  });

  it('should create an instance of itself from another component', function() {
    var element = {};
    var component = new Component(element);
    var Test = sinon.spy(Component);
    var test = Test.from(component);

    expect(Test).to.have.been.calledWith(element);
    expect(test).to.be.instanceOf(Component);
  });

  it('should create a getter', function() {
    var element = {};
    var component = new Component(element);

    component.hello = 'world';
    component.getter('test', function() {
      return this.hello;
    });

    expect(component.test).to.be.defined;
    expect(component.test).to.equal('world');
  });

  it('should create getters', function() {
    var element = {};
    var component = new Component(element);
    var props = {};

    component.getters(props);

    expect(getters).to.have.been.calledWith(component, props);
  });
});
