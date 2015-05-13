'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var expect = require('chai').use(sinonChai).expect;
var items = require('../../../lib/html/properties/items');

describe('HTML: items property', function() {
  var context;
  var mapper;
  var firstItem;
  var secondItem;

  beforeEach(function() {
    firstItem = sinon.stub({getText: function() {}});
    firstItem.getText.returns('first');

    secondItem = sinon.stub({getText: function() {}});
    secondItem.getText.returns('second');

    mapper = {
      map: function(callback) {
        return Q.all([
          callback.call(context, firstItem),
          callback.call(context, secondItem)
        ]);
      }
    };

    context = sinon.stub({find: function() {}});
    context.find.returns(mapper);
  });

  it('should evaluate to true when it matches the inner text', function() {
    return items.call(context).then(function(results) {
      expect(results).to.deep.equal(['first', 'second']);
    });
  });
});
