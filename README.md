# Tinto
[![Build Status](https://travis-ci.org/rochdev/tinto.svg)](https://travis-ci.org/rochdev/tinto)
[![Test Coverage](https://codeclimate.com/github/rochdev/tinto/badges/coverage.svg)](https://codeclimate.com/github/rochdev/tinto)
[![Code Climate](https://codeclimate.com/github/rochdev/tinto/badges/gpa.svg)](https://codeclimate.com/github/rochdev/tinto)
[![Dependency Status](https://gemnasium.com/rochdev/tinto.svg)](https://gemnasium.com/rochdev/tinto)
[![Inline docs](http://inch-ci.org/github/rochdev/tinto.svg?branch=master)](http://inch-ci.org/github/rochdev/tinto)

A functional testing framework for component-based web applications

## Usage

### Assertions syntax

#### Components

##### Property assertion
```js
searchButton.should.have.text('Search');
```

##### State assertion
```js
searchButton.should.be.enabled;
```

##### Count assertion
```js
grid.should.have(3).rows;
```

##### Multiple assertions
```js
searchButton.should.have.text('Search').and.be.enabled;
```

##### Multiple assertions (alternate syntax)
```js
searchButton.should(
  have.text('Search'),
  be.enabled
);
```

#### Attributes
```js
searchButton.text.should.equal('Search');
```

### Component definition

##### ES5
```js
function Grid(locator) {
  Component.call(this, locator);
  
  this.getter('rows', function() {
    return this.find('tr');
  });
}

tinto.inherits(Grid, Component);
```

##### ES6
```js
class Grid extends Component {
  get rows() {
    return this.find('tr');
  }
}
```

##### .extend
```js
var Grid = Component.extend({
  get rows() {
    return this.find('tr');
  }
});
```

### Command-line interface

In order to use the CLI, you must install tinto globally. You can then run `tinto --help` to list available commands.

## Examples

See the [example](example) folder for a complete example.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

## Credits

This project was inspired by the excellent [Testatoo](http://www.testatoo.org) functional testing library for Java.
