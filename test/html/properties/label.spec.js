'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: label property', function() {
  var label;
  var element;
  var context;
  var document;
  var labelElement;

  beforeEach(function() {
    labelElement = {
      textContent: 'bar',
      tagName: 'LABEL'
    };

    element = {
      getAttribute: sinon.stub().withArgs('id').returns('foo')
    };

    context = {
      execute: sinon.spy(function(callback) {
        return Q.when(callback.call(element));
      }),
      toString: sinon.stub().returns('Foo')
    };

    document = {
      querySelector: sinon.stub().withArgs('label[for="foo"]')
    };

    global.document = document;

    label = require('../../../lib/html/properties/label');
  });

  afterEach(function() {
    delete global.document;
  });

  it('should return the label matching the component ID', function() {
    document.querySelector.returns(labelElement);

    return label.call(context).then(function(result) {
      expect(result).to.equal('bar');
    });
  });

  it('should return an ancestor label if no matching ID has been found', function() {
    document.querySelector.returns(null);
    element.parentElement = labelElement;

    return label.call(context).then(function(result) {
      expect(result).to.equal('bar');
    });
  });

  it('should throw an error if no label has been found', function() {
    document.querySelector.returns(null);
    element.parentElement = null;

    return label.call(context).catch(function(e) {
      expect(e.message).to.equal('Foo does not have a label');
    });
  });
});
