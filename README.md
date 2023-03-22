# Styl2scss

Convert stylus to scss

## Installation

```bash
npm i -g styl2scss
```

## Usage
```bash
s2s
```

## Configuration

Create the `style2scss.config.js` file above in the project with the following options:

`ignore` - list of ignored globs (*default* - `['node_modules/**']`);

`convertStyles` - enable styles conversion (*default* - `true`);

`removeOldStyles` - remove old styles (*default* - `false`);

`updateJSX` - update style imports in jsx/tsx files (*default* - `false`);

## Known issues

If the original styles were wrong, the result will also be wrong. For example, if there were block brackets in the source file - as a result, there may be one more bracket in this place.

## License

[MIT](https://github.com/finomenal/styl2scss/blob/main/LICENSE)
