'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('Page', function() {
  var Page;
  var Component;
  var page;

  before(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
      warnOnReplace: false
    });
  });

  beforeEach(function() {
    Component = require('./mocks/component');
    mockery.registerMock('./component', Component);
    Page = require('../lib/page');

    page = new Page();
  });

  after(function() {
    mockery.disable();
  });

  it('should extend Component', function() {
    expect(page).to.be.instanceof(Component);
  });

  it('should have property title', function() {
    var caption = sinon.stub({first: function() {}});

    Component.prototype.find.withArgs('title').returns(caption);
    caption.first.returns(new Component());

    return page.title.then(function(title) {
      expect(title).to.equal('text');
    });
  });
});
