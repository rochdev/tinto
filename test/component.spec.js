'use strict';

var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var Component = rewire('../lib/component');
var expect = require('chai').use(sinonChai).expect;

describe('Component', function() {
  var ComponentCollection;
  var tinto;
  var queue;
  var extend;
  var element;
  var promise;
  var locator;
  var component;
  var evaluator;
  var driver;

  beforeEach(function() {
    ComponentCollection = sinon.spy();

    tinto = {};

    queue = sinon.stub({
      push: function() {}
    });

    extend = sinon.spy(function() {return 'test';});

    element = sinon.stub({
      findElements: function() {},
      getAttribute: function() {},
      getText: function() {},
      click: function() {},
      sendKeys: function() {},
      clear: function() {}
    });

    driver = {
      wait: sinon.spy(function(until) {
        return until();
      })
    };

    evaluator = sinon.stub({
      execute: function() {},
      find: function() {},
      getDriver: function() {}
    });
    evaluator.execute.returns(Q.resolve('uuid'));
    evaluator.find.returns(Q.resolve('component'));
    evaluator.getDriver.returns(driver);

    promise = Q.resolve(element);

    locator = {
      locate: sinon.stub().returns(promise),
      getMessage: sinon.stub().returns('test')
    };

    Component.__set__('ComponentCollection', ComponentCollection);
    Component.__set__('bundles', tinto);
    Component.__set__('queue', queue);
    Component.__set__('extend', extend);
    Component.__set__('evaluator', evaluator);

    component = new Component(locator);
  });

  it('should have a unique string identifier', function() {
    locator.id = 'uuid';

    var name = component.toString();

    expect(name).to.equal('[Component:uuid]');
  });

  it('should have a string representation without an identifier', function() {
    expect(component.toString()).to.equal('test');
  });

  it('should be able to find sub-components', function() {
    var subComponents = component.find('#test');

    expect(subComponents).to.be.instanceOf(ComponentCollection);
    expect(ComponentCollection.firstCall.args[1]).to.have.property('parent', component);
    expect(ComponentCollection.firstCall.args[1]).to.have.property('selector', '#test');
  });

  it('should allow disabling the cache', function() {
    component.find('#test', false);

    expect(ComponentCollection.firstCall.args[1]).to.have.property('cache', false);
  });

  it('should be able to cast itself to another component type', function() {
    var Test = sinon.spy();
    var test = component.as(Test);

    expect(Test).to.have.been.calledWith(locator);
    expect(test).to.be.instanceof(Test);
  });

  it('should get its element', function() {
    return expect(component.getElement()).to.eventually.equal(element);
  });

  it('should throw when it could not get its element', function() {
    locator.locate.returns(Q.reject());

    return expect(component.getElement()).to.eventually.be.rejected;
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

  it('should clear text on the component', function() {
    component.clear();

    expect(queue.push).to.have.been.called;

    return queue.push.firstCall.args[0]().then(function() {
      expect(element.clear).to.have.been.called;
    });
  });

  it('should execute scripts', function() {
    var callback = function() {};

    return component.execute(callback, 1, 2).then(function() {
      expect(evaluator.execute).to.have.been.called;
      expect(evaluator.execute.firstCall.args[1]).to.equal(callback);
      expect(evaluator.execute.firstCall.args[2]).to.equal(1);
      expect(evaluator.execute.firstCall.args[3]).to.equal(2);

      return evaluator.execute.firstCall.args[0].then(function(response) {
        expect(response).to.equal(element);
      });
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

    expect(Test).to.have.been.calledWith(locator);
    expect(test).to.be.instanceOf(Component);
  });

  it('should store and execute a supported countable', function() {
    var items = sinon.spy(function() {
      var collection = function() {};

      collection.count = function() {
        return 2;
      };

      return collection;
    });

    component.getter('items', items);

    return component.has(2, 'items')().then(function(result) {
      expect(result.outcome).to.be.true;
      expect(result.expected).to.equal(2);
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
    });
  });

  it('should support state arguments', function() {
    var test = sinon.spy(function(value) {
      return value;
    });

    component.state('test', test, [true]);

    return component.is('test')().then(function(result) {
      expect(result.outcome).to.be.true;
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
      expect(result.expected).to.deep.equal(value);
      expect(result.actual).to.deep.equal(value);
      expect(test.thisValues[0]).to.equal(component);
    });
  });

  it('should support property arguments', function() {
    var test = sinon.spy(function(foo) {
      return foo;
    });

    component.property('test', test, ['foo']);

    return component.has('test', 'foo')().then(function(result) {
      expect(result.outcome).to.be.true;
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
      expect(result.expected).to.equal('a value');
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
      expect(test.thisValues[0]).to.equal(component);
    });
  });

  it('should support states from a bundle with arguments', function() {
    var test = sinon.spy(function(value) {
      return value;
    });

    tinto.test = {
      states: {
        test: test
      }
    };

    component.__bundle__ = 'test';
    component.state('test', [true]);

    return component.is('test')().then(function(result) {
      expect(result.outcome).to.be.true;
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
      expect(result.expected).to.equal('a value');
      expect(result.actual).to.equal('a value');
      expect(test.thisValues[0]).to.equal(component);
    });
  });

  it('should support properties from a bundle with arguments', function() {
    var test = sinon.spy(function(value) {
      return value;
    });

    tinto.test = {
      properties: {
        test: test
      }
    };

    component.__bundle__ = 'test';
    component.property('test', ['a value']);

    return component.has('test', 'a value')().then(function(result) {
      expect(result.outcome).to.be.true;
    });
  });

  it('should support contains', function() {
    var context = sinon.stub({
      contains: function() {}
    });
    var child = new Component(locator);

    context.contains.returns(Q.resolve(true));

    evaluator.execute = function(element, callback) {
      return Q.resolve(callback.apply(context));
    };

    locator.id = 'uuid';

    return component.contains(child)().then(function(results) {
      expect(results[0].outcome).to.be.true;
      expect(results[0].expected).to.equal('[Component:uuid]');
    });
  });

  it('should support equals', function() {
    var clone = new Component(locator);

    evaluator.execute = function(context, callback) {
      return Q.resolve(callback.call(element, element));
    };

    locator.id = 'uuid';

    return component.equals(clone)().then(function(result) {
      expect(result.outcome).to.be.true;
      expect(result.expected).to.equal(component.toString());
      expect(result.actual).to.equal(clone.toString());
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

  it('should be available when the element can be found', function() {
    return expect(component.is('available')()).to.eventually.have.property('outcome', true);
  });

  it('should be missing when the element cannot be found', function() {
    locator.locate.returns(Q.resolve());

    component = new Component(locator);

    return expect(component.is('missing')()).to.eventually.have.property('outcome', true);
  });

  it('should not be available when the element cannot be found', function() {
    locator.locate.returns(Q.resolve());

    component = new Component(locator);

    return expect(component.is('available')()).to.eventually.have.property('outcome', false);
  });

  it('should not be missing when the element can be found', function() {
    return expect(component.is('missing')()).to.eventually.have.property('outcome', false);
  });
});
