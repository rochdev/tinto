'use strict';

var Q = require('q');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('Locator', function() {
  var Locator;
  var locator;
  var uuid;
  var parent;
  var promise;
  var elements;
  var evaluator;
  var context;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    uuid = {
      v4: sinon.stub().returns('uuid')
    };

    context = sinon.stub({
      getAttribute: function() {},
      setAttribute: function() {}
    });

    evaluator = {
      find: sinon.stub(),
      getDriver: sinon.stub().returns(parent),
      execute: sinon.spy(function(element, callback, id) {
        return Q.resolve(callback.call(context, id));
      })
    };

    elements = [1, 2];

    parent = {
      findElements: sinon.stub().withArgs(sinon.match({css: 'test'})).returns(Q.resolve(elements))
    };

    promise = {
      getElement: sinon.stub().returns(Q.resolve(parent))
    };

    mockery.registerMock('node-uuid', uuid);
    mockery.registerMock('./evaluator', evaluator);

    Locator = require('../../lib/utils/locator');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should instantiate with the right values', function() {
    locator = new Locator('parent', 'selector', 'index');

    expect(locator).to.have.property('parent', 'parent');
    expect(locator).to.have.property('selector', 'selector');
    expect(locator).to.have.property('index', 'index');
  });

  it('should locate an existing element', function() {
    locator = new Locator(promise, 'selector');
    locator.id = 'uuid';

    evaluator.find.withArgs('[data-tinto-id="uuid"]').returns([1]);

    return expect(locator.locate()).to.eventually.equal(1);
  });

  it('should locate an element collection', function() {
    locator = new Locator(promise, 'test');

    return expect(locator.locate()).to.eventually.deep.equal(elements);
  });

  it('should locate an element with an index', function() {
    locator = new Locator(promise, 'test', 0);

    return expect(locator.locate()).to.eventually.equal(1);
  });

  it('should locate an element with an index starting from the end', function() {
    locator = new Locator(promise, 'test', -1);

    return expect(locator.locate()).to.eventually.equal(2);
  });

  it('should locate an element with no known parent', function() {
    locator = new Locator(null, 'test');

    return expect(locator.locate()).to.eventually.deep.equal(elements);
  });

  it('should synchronize its identifier with the underlying DOM element', function() {
    locator = new Locator(null, 'test', 0);

    return locator.locate().then(function() {
      expect(locator).to.have.property('id', 'uuid');
      expect(context.setAttribute).to.have.been.calledWithMatch('data-tinto-id', 'uuid');
    });
  });

  it('should include the selector in its message', function() {
    locator = new Locator(null, '#test');

    expect(locator.getMessage()).to.equal(
      'an element matching selector "#test"'
    );
  });

  it('should include the parent in its message', function() {
    locator = new Locator({
      toString: function() {
        return 'parent';
      }
    }, '#test');

    expect(locator.getMessage()).to.equal(
      'an element matching selector "#test" under parent'
    );
  });

  it('should include the index in its message', function() {
    locator = new Locator(null, '#test', 1);

    expect(locator.getMessage()).to.equal(
      'an element matching selector "#test" at index 1'
    );
  });
});
