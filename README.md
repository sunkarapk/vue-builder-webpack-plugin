# vue-builder-webpack-plugin

Webpack plugin to build vue files automatically

Are you having issues with editors when working on vue files? This is for you

Do you want to separate your `vue` file? This is for you

You just don't like having the vue file? This is for you

You can use this plugin to automatically generate `.vue` files.

## Installation

```
$ npm install vue-builder-webpack-plugin --save-dev
```

## Usage

In your `webpack.config.js`

```js
var VueBuilder = require('vue-builder-webpack-plugin');
 
module.exports = {
    // ... 
    plugins: [
      new VueBuilder({
      	  path: 'src'
      });
    ]
};
```

Whenever you run webpack in normal or watch mode, this plugin will automatically generate your `.vue` files.

#### Options

* `path`: Either absolute path or the relative path to the main project folder. Used to search for building vue files.
* `folder`: If `true`, will support placing of individual files in a folder. Default `false`. See example below.

## Example

If you have the following files, `App.vue.js`, `App.vue.css`, `App.vue.html`, the generated `App.vue` file will look like this:

```vue
<template src="./App.vue.html" lang="html"></template>
<script src="./App.vue.js" lang="js"></script>
<style src="./App.vue.css" lang="css"></style>
```

You can also rename the `App.vue.css` to `App.scoped.vue.css` to generate the following `style` tag:

```vue
<style src="./App.scoped.vue.css" lang="css" scoped></style>
```

This plugin inherently supports `jade`, `coffee`, `sass`, `scss`, `styl`, `less` as languages in vue file.

### Folder scenario

When you have the option `folder` set to `true`, you can place the files `App.vue.js`, `App.vue.css`, `App.vue.html` inside a folder named
`App` and the plugin will generate a file named `App.vue` alongside the `App` folder.

If you like this project, please watch this and follow me.

## Contributors
Here is a list of [Contributors](http://github.com/pksunkara/vue-builder-webpack-plugin/contributors)

### TODO

__I accept pull requests and guarantee a reply back within a day__

## License
MIT/X11

## Bug Reports
Report [here](http://github.com/pksunkara/vue-builder-webpack-plugin/issues). __Guaranteed reply within a day__.

## Contact
Pavan Kumar Sunkara (pavan.sss1991@gmail.com)

Follow me on [github](https://github.com/users/follow?target=pksunkara), [twitter](http://twitter.com/pksunkara)
