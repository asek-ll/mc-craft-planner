const Datastore = require('nedb');
const path = require('path');
const _ = require('lodash');

const targetPath = path.join('.', '..', 'data');

const recipesDb = new Datastore({
  filename: path.join(targetPath, 'recipes.db'),
  autoload: true
});

//const handlersDb = new Datastore({
//filename: path.join(targetPath, 'handlers.db'),
//autoload: true
//});

const getCoordKey = function(item) {
  return item.x + '_' + item.y;
};

recipesDb.find({}, function(err, docs) {
  var handlers = new Set();

  _.each(docs, function(doc) {
    var handlerName = doc.handlerName;
    handlers.add(handlerName.trim());
  });



  //handlersDb.insert([]);

  //var sortedHandlers = Array.from(handlers).sort();
  //console.log(sortedHandlers);
});
