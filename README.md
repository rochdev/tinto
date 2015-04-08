# Tinto
[![Build Status](https://travis-ci.org/rochdev/tinto.svg)](https://travis-ci.org/rochdev/tinto)
[![Test Coverage](https://codeclimate.com/github/rochdev/tinto/badges/coverage.svg)](https://codeclimate.com/github/rochdev/tinto)
[![Code Climate](https://codeclimate.com/github/rochdev/tinto/badges/gpa.svg)](https://codeclimate.com/github/rochdev/tinto)
[![Dependency Status](https://gemnasium.com/rochdev/tinto.svg)](https://gemnasium.com/rochdev/tinto)
[![Inline docs](http://inch-ci.org/github/rochdev/tinto.svg?branch=master)](http://inch-ci.org/github/rochdev/tinto)

A functional testing framework for component-based web applications

## Usage

### Component definition

**ES5**
```js
function Grid(locator) {
  Component.call(this, locator);
  
  this.getter('rows', function() {
    return this.find('tr');
  });
}

tinto.inherits(Grid, Component);
```

**ES6**
```js
class Grid extends Component {
  constructor: function(locator) {
    super(locator);
  }
  
  get rows() {
    return this.find('tr');
  }
}
```

**.extend**
```js
var Grid = Component.extend({
  get rows() {
    return this.find('tr');
  }
});
```

## Examples

See the [example](example) folder for a complete example.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

