var path = require('path');
var _ = require('underscore');
var Datastore = require('nedb');
var fs = require('fs');

var rmdir = function (dir) {
  var list = fs.readdirSync(dir);
  for (var i = 0; i < list.length; i++) {
    var filename = path.join(dir, list[i]);
    var stat = fs.statSync(filename);

    if (filename == "." || filename == "..") {
      // pass these files
    } else if (stat.isDirectory()) {
      // rmdir recursively
      rmdir(filename);
    } else {
      // rm fiilename
      fs.unlinkSync(filename);
    }
  }
  fs.rmdirSync(dir);
};

var dataPath = process.argv[2];
var targetPathName = process.argv[3] || 'data-generated';
var targetPath = path.join('.', '..', targetPathName);

if (fs.existsSync(targetPath)) {
  rmdir(targetPath);
}

fs.mkdirSync(targetPath);

var itemDb = new Datastore({
  filename: path.join(targetPath, 'items.db'),
  autoload: true
});


var items = require(path.join(dataPath, './items.json'));

_.each(items, function (item) {
  itemDb.insert(item);
});

var recipesDb = new Datastore({
  filename: path.join(targetPath, 'recipes.db'),
  autoload: true
});

var recipes = require(path.join(dataPath, './recipes.json'));

_.each(recipes, handler => {
  var handlerName = handler.title;
  _.each(handler.recipes, recipe => {
    recipe.handlerName = handlerName;
    recipesDb.insert(recipe);
  });
});
