'use strict';

var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var Attribute = require('../lib/attribute');
var Component = rewire('../lib/component');
var expect = require('chai').use(sinonChai).expect;

describe('Component', function() {
  var ComponentCollection;
  var PropertyAssertion;
  var StateAssertion;
  var CountAssertion;
  var tinto;
  var queue;
  var extend;
  var descriptors;
  var element;
  var promise;
  var component;

  beforeEach(function() {
    ComponentCollection = sinon.spy();
    CountAssertion = sinon.stub({register: function() {}});
    PropertyAssertion = sinon.stub({register: function() {}});
    StateAssertion = sinon.stub({register: function() {}});

    tinto = {};

    queue = sinon.stub({
      push: function() {}
    });

    extend = sinon.spy(function() {return 'test';});

    descriptors = sinon.stub();

    element = sinon.stub({
      findElements: function() {},
      getAttribute: function() {},
      getText: function() {},
      getDriver: function() {},
      click: function() {},
      sendKeys: function() {}
    });

    promise = Q.resolve(element);

    Component.__set__('ComponentCollection', ComponentCollection);
    Component.__set__('PropertyAssertion', PropertyAssertion);
    Component.__set__('StateAssertion', StateAssertion);
    Component.__set__('CountAssertion', CountAssertion);
    Component.__set__('tinto', tinto);
    Component.__set__('queue', queue);
    Component.__set__('extend', extend);
    Component.__set__('descriptors', descriptors);

    component = new Component(promise);
  });

  it('should be able to find sub-components by selector string', function() {
    var subComponents = component.find('#test');

    return promise.then(function() {
      expect(element.findElements).to.have.been.calledWithMatch({css: '#test'});
      expect(subComponents).to.be.instanceOf(ComponentCollection);
    });
  });

  it('should be able to find sub-components by locator function', function() {
    var locator = function() {
      return 'test';
    };

    element.getDriver.returns({
      executeScript: function(script, element, $, callback) {
        return callback();
      }
    });

    var subComponents = component.find(locator);

    return promise.then(function() {
      expect(subComponents).to.be.instanceOf(ComponentCollection);

      return ComponentCollection.firstCall.args[0].then(function(value) {
        expect(value).to.equal('test');
      });
    });
  });

  it('should get its attributes', function() {
    element.getAttribute.withArgs('name').returns(Q.resolve('test'));

    var result = component.getAttribute('name');

    return Q.all([promise, result]).then(function(results) {
      expect(element.getAttribute).to.have.been.calledWithMatch('name');
      expect(results[1]).to.equal('test');
    });
  });

  it('should get its text', function() {
    element.getText.returns(Q.resolve('test'));

    var result = component.getText();

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
    component.enter('hello', 'world');

    expect(queue.push).to.have.been.called;

    return queue.push.args[0][0]().then(function() {
      expect(element.sendKeys).to.have.been.calledWith('hello');
      expect(element.sendKeys).to.have.been.calledWith('hello', 'world');
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
    var Test = sinon.spy(Component);
    var test = Test.from(component);

    expect(Test).to.have.been.calledWith(promise);
    expect(test).to.be.instanceOf(Component);
  });

  it('should create a getter', function() {
    component.hello = 'world';
    component.getter('test', function() {
      return this.hello;
    });

    expect(component.test).to.be.defined;
    expect(component.test).to.equal('world');
  });

  it('should create getters from functions', function() {
    var props = {
      foo: function() {return 'foo';},
      get bar() {return 'bar';},
      baz: 'baz'
    };

    descriptors.withArgs(props).returns({
      foo: Object.getOwnPropertyDescriptor(props, 'foo'),
      bar: Object.getOwnPropertyDescriptor(props, 'bar'),
      baz: Object.getOwnPropertyDescriptor(props, 'baz')
    });

    component.getters(props);

    var foo = Object.getOwnPropertyDescriptor(component, 'foo');
    var bar = Object.getOwnPropertyDescriptor(component, 'bar');

    expect(descriptors).to.have.been.calledWith(props);
    expect(component.foo).to.be.defined;
    expect(component.foo).to.equal('foo');
    expect(foo).to.have.property('configurable', true);
    expect(foo).to.have.property('enumerable', true);
    expect(component.bar).to.be.defined;
    expect(component.bar).to.equal('bar');
    expect(bar).to.have.property('configurable', true);
    expect(bar).to.have.property('enumerable', true);
    expect(component.baz).to.be.undefined;
  });

  it('should create count assertions from getters', function(done) {
    component.getter('test', function() {});

    descriptors.withArgs(component).returns({
      test: Object.getOwnPropertyDescriptor(component, 'test')
    });

    setTimeout(function() {
      expect(CountAssertion.register).to.have.been.calledWith('test');
      done();
    }, 0);
  });

  it('should store and execute a supported countable', function() {
    var items = sinon.spy(function() {
      return {
        length: 2
      };
    });

    component.getter('items', items);

    return component.has(2, 'items')().then(function(result) {
      expect(result.outcome).to.be.true;
      expect(result.actual).to.equal(2);
      expect(items.thisValues[0]).to.equal(component);
    });
  });

  it('should store and execute a supported state', function() {
    var test = sinon.spy(function() {
      return true;
    });

    component.state('test', test);

    return component.is('test')().then(function(result) {
      expect(result.outcome).to.be.true;
      expect(result.actual).to.be.false;
      expect(test.thisValues[0]).to.equal(component);
    });
  });

  it('should store and execute a supported property', function() {
    var value = ['foo', 'bar'];
    var test = sinon.spy(function() {
      return value;
    });

    component.property('test', test);

    return component.has('test', ['foo', 'bar'])().then(function(result) {
      expect(result.outcome).to.be.true;
      expect(result.actual).to.equal(value);
      expect(test.thisValues[0]).to.equal(component);
    });
  });

  it('should store a supported property as an attribute', function() {
    var test = sinon.spy(function() {
      return 'a value';
    });

    component.property('test', test);

    expect(component.test).to.be.instanceof(Attribute);

    return component.test.value.then(function(result) {
      expect(result).to.equal('a value');
      expect(test.thisValues[0]).to.equal(component);
    });
  });

  it('should store and execute supported states', function() {
    component.states({
      first: function() {
        return true;
      },
      second: function() {
        return false;
      }
    });

    var isFirst = component.is('first')();
    var isSecond = component.is('second')();

    return Q.all([isFirst, isSecond]).then(function(results) {
      expect(results[0].outcome).to.be.true;
      expect(results[0].actual).to.be.false;
      expect(results[1].outcome).to.be.false;
      expect(results[1].actual).to.be.true;
    });
  });

  it('should store and execute supported properties', function() {
    component.properties({
      first: function() {
        return 'first value';
      },
      second: function() {
        return 'second value';
      }
    });

    var hasFirst = component.has('first', 'first value')();
    var hasSecond = component.has('second', 'second value')();

    return Q.all([hasFirst, hasSecond]).then(function(results) {
      expect(results[0].outcome).to.be.true;
      expect(results[0].actual).to.equal('first value');
      expect(results[1].outcome).to.be.true;
      expect(results[1].actual).to.equal('second value');
    });
  });

  it('should support html states', function() {
    var test = sinon.spy(function() {
      return true;
    });

    tinto.html = {
      states: {
        test: test
      }
    };

    component.state('test');

    return component.is('test')().then(function(result) {
      expect(result.outcome).to.be.true;
      expect(result.actual).to.be.false;
      expect(test.thisValues[0]).to.equal(component);
    });
  });

  it('should support html properties', function() {
    var test = sinon.spy(function() {
      return 'a value';
    });

    tinto.html = {
      properties: {
        test: test
      }
    };

    component.property('test');

    return component.has('test', 'a value')().then(function(result) {
      expect(result.outcome).to.be.true;
      expect(result.actual).to.equal('a value');
      expect(test.thisValues[0]).to.equal(component);
    });
  });

  it('should support states from a bundle', function() {
    var test = sinon.spy(function() {
      return true;
    });

    tinto.test = {
      states: {
        test: test
      }
    };

    component.__bundle__ = 'test';
    component.state('test');

    return component.is('test')().then(function(result) {
      expect(result.outcome).to.be.true;
      expect(result.actual).to.be.false;
      expect(test.thisValues[0]).to.equal(component);
    });
  });

  it('should support properties from a bundle', function() {
    var test = sinon.spy(function() {
      return 'a value';
    });

    tinto.test = {
      properties: {
        test: test
      }
    };

    component.__bundle__ = 'test';
    component.property('test');

    return component.has('test', 'a value')().then(function(result) {
      expect(result.outcome).to.be.true;
      expect(result.actual).to.equal('a value');
      expect(test.thisValues[0]).to.equal(component);
    });
  });

  it('should throw an error when trying to register a state that does not exist', function() {
    tinto.html = {};

    expect(function() {
      component.state('test');
    }).to.throw('State "test" does not exist');
  });

  it('should throw an error when trying to register a property that does not exist', function() {
    tinto.html = {};

    expect(function() {
      component.property('test');
    }).to.throw('Property "test" does not exist');
  });

  it('should throw an error when trying to use a state that does not exist', function() {
    expect(function() {
      component.is('test')();
    }).to.throw('Unsupported state "test"');
  });

  it('should throw an error when trying to use a property that does not exist', function() {
    expect(function() {
      component.has('test', 'first value')();
    }).to.throw('Unsupported property "test"');
  });

  it('should throw an error when trying to use a countable that is not a collection', function() {
    var items = sinon.spy(function() {
      return {};
    });

    component.getter('items', items);

    expect(function() {
      component.has(2, 'items')();
    }).to.throw('Count assertions can only be applied to collections');
  });

  it('should register assertions for its properties', function() {
    component.property('test', function() {});

    expect(PropertyAssertion.register).to.have.been.calledWith('test');
  });

  it('should register assertions for its states', function() {
    component.state('test', function() {});

    expect(StateAssertion.register).to.have.been.calledWith('test');
  });
});
