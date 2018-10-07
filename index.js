const recursiveRead = require('recursive-readdir');
const path = require('path');
const fs = require('fs');

let directory = __dirname;
let folder = false;
let allScoped = false;

const VueBuilderPlugin = (options) => {
  if (path.isAbsolute(options.path)) {
    directory = options.path;
  } else {
    directory = path.resolve(path.join(__dirname, '..', '..', options.path || ''));
  }

  if (options.folder) {
    folder = true;
  }

  if (options.allScoped) {
    allScoped = true;
  }
};

const buildVues = (callback) => {
  // eslint-disable-next-line no-console
  console.log('Building vue files');

  recursiveRead(directory, (err, files) => {
    if (err) {
      return callback(err);
    }

    const vues = {};
    const sources = {
      script: {},
      template: {},
      style: {},
    };

    const langCheck = (file, extension, type) => {
      const length = -5 - extension.length;
      let scoped = false;

      if (file.slice(length) === `.vue.${extension}`) {
        let name = file.slice(0, length);

        if (type === 'style' && name.slice(-7) === '.scoped') {
          scoped = true;
          name = name.slice(0, -7);
        }

        if (type === 'style' && allScoped) {
           scoped = true;
        }

        vues[name] = true;
        sources[type][name] = {
          file,
          lang: extension,
        };

        if (scoped) {
          sources.style[name].scoped = true;
        }

        return true;
      }

      return false;
    };

    const singleVue = (name, dirname) => {
      let data = '';

      const script = sources.script[name];
      const style = sources.style[name];
      const template = sources.template[name];

      const relate = file => `.${path.sep}${path.relative(dirname, file)}`;

      data += `<script src="${relate(script.file)}" lang="${script.lang}"></script>\n`;
      data += `<style src="${relate(style.file)}" lang="${style.lang}"${style.scoped ? ' scoped' : ''}></style>\n`;
      data += `<template src="${relate(template.file)}" lang="${template.lang}"></template>\n`;

      return data;
    };

    files.forEach((file) => {
      if (langCheck(file, 'html', 'template')) {
        return;
      }

      if (langCheck(file, 'js', 'script')) {
        return;
      }

      if (langCheck(file, 'css', 'style')) {
        return;
      }

      // HTML alternatives
      if (langCheck(file, 'jade', 'template')) {
        return;
      }

      if (langCheck(file, 'pug', 'template')) {
        return;
      }

      // JS alternatives
      if (langCheck(file, 'coffee', 'script')) {
        return;
      }

      if (langCheck(file, 'ts', 'script')) {
        return;
      }

      // CSS alternatives
      if (langCheck(file, 'sass', 'style')) {
        return;
      }

      if (langCheck(file, 'scss', 'style')) {
        return;
      }

      if (langCheck(file, 'less', 'style')) {
        return;
      }

      langCheck(file, 'styl', 'style');
    });

    Object.keys(vues).forEach((vue) => {
      let dest = vue;

      if (folder && path.basename(vue) === path.basename(path.dirname(vue))) {
        dest = path.dirname(vue);
      }

      if (sources.script[vue] && sources.style[vue] && sources.template[vue]) {
        fs.writeFileSync(`${dest}.vue`, singleVue(vue, path.dirname(dest)), 'utf8');
      }
    });

    return callback();
  });
};

VueBuilderPlugin.prototype.apply = (compiler) => {
  compiler.plugin('run', (compilation, callback) => buildVues(callback));
  compiler.plugin('watch-run', (compilation, callback) => buildVues(callback));

  compiler.plugin('after-compile', (compilation, callback) => {
    // eslint-disable-next-line no-param-reassign
    compilation.fileDependencies = Array.from(compilation.fileDependencies).filter((file) => {
      if (file.slice(-4) === '.vue') {
        return false;
      }

      return true;
    });

    callback();
  });
};

module.exports = VueBuilderPlugin;
