var recursiveRead = require('recursive-readdir')
  , path = require('path')
  , fs = require('fs')
  , directory = __dirname;

function VueBuilderPlugin (options) {
  if (path.isAbsolute(options.path)) {
    directory = options.path;
  } else {
    directory = path.resolve(path.join(__dirname, '..', '..', options.path || ''));
  }
}

function buildVues(callback) {
  console.log('Building vue files');

  recursiveRead(directory, function (err, files) {
    if (err) {
      return callback(err);
    }

    var vues = {}, sources = {
      script: {},
      template: {},
      style: {}
    };

    function langCheck(file, extension, type) {
      var length = -5 - extension.length;
      var scoped = false;

      if (file.slice(length) == '.vue.' + extension) {
        var name = file.slice(0, length);

        if (type == 'style' && name.slice(-7) == '.scoped') {
          scoped = true;
          name = name.slice(0, -7)
        }

        vues[name] = true;
        sources[type][name] = {
          file: file,
          lang: extension
        };

        if (scoped) {
          sources.style[name].scoped = true;
        }

        return true;
      }

      return false;
    }

    function singleVue(name) {
      var data = '';

      var script = sources.script[name];
      var style = sources.style[name];
      var template = sources.template[name];

      data += '<script src="' + script.file + '" lang="' + script.lang + '"></script>\n';
      data += '<style src="' + style.file + '" lang="' + style.lang + '"' + (style.scoped ? ' scoped' : '') + '></style>\n';
      data += '<template src="' + template.file + '" lang="' + template.lang + '"></template>\n';

      return data;
    }

    files.forEach(function (file) {
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

      // JS alternatives
      if (langCheck(file, 'coffee', 'script')) {
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

      if (langCheck(file, 'styl', 'style')) {
        return;
      }
    });

    Object.keys(vues).forEach(function (vue) {
      if (sources.script[vue] && sources.style[vue] && sources.template[vue]) {
        fs.writeFileSync(vue + '.vue', singleVue(vue, sources), 'utf8');
      }
    });

    callback();
  });
}

VueBuilderPlugin.prototype.apply = function(compiler) {
  compiler.plugin('run', function (compilation, callback) {
    buildVues(callback);
  });

  compiler.plugin('watch-run', function (compilation, callback) {
    buildVues(callback);
  });

  compiler.plugin('after-compile', function (compilation, callback) {
    compilation.fileDependencies = compilation.fileDependencies.filter(function (file) {
      if (file.slice(-4) == '.vue') {
        return false;
      }

      return true;
    });

    callback();
  });
};

module.exports = VueBuilderPlugin;
