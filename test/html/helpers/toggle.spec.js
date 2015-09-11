'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: toggle helper', function() {
  var toggle;
  var queue;
  var component;
  var state;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    queue = sinon.stub({push: function() {}});

    state = sinon.stub();

    component = {
      is: sinon.stub().withArgs('active').returns(state),
      click: sinon.spy(),
      toString: sinon.stub().returns('Foo')
    };

    mockery.registerMock('../../queue', queue);

    toggle = require('../../../lib/html/helpers/toggle');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should toggle a state by clicking', function() {
    state.returns(Q.when({outcome: false}));

    toggle(component, 'active');

    return queue.push.firstCall.args[0]().then(function() {
      expect(component.click).to.have.been.called;
    });
  });

  it('should throw an error if toggling an already active state', function() {
    state.returns(Q.when({outcome: true}));

    toggle(component, 'active');

    return queue.push.firstCall.args[0]().catch(function(e) {
      expect(e.message).to.equal('Foo is already active and cannot be active');
    });
  });

  it('should return the component', function() {
    state.returns(Q.when({outcome: false}));

    expect(toggle(component, 'active')).to.equal(component);
  });
});
