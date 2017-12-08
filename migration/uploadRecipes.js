const MongoClient = require('mongodb').MongoClient
  , assert = require('assert')
  , Datastore = require('nedb')
  , _ = require('lodash')
  , fs = require('fs')
  , async = require('async');


const url = 'mongodb://crab:aO3UHc81WlkD6lorClka@ds163034.mlab.com:63034/crab';


const recipesDb = new Datastore({
  filename: '../data_sets/data/recipes.db',
  autoload: true
});

recipesDb.find({}).exec((err, recipes) => {
  console.log("Recipes count", recipes.length);

  MongoClient.connect(url, function (err, db) {
    var itemsMongoDb = db.collection('items');
    var recipesMongoDb = db.collection('recipes');

    index = 0;

    async.eachSeries(recipes, (recipe, resolve) => {

      var promisesBySids = {};

      let processPosStack = function (posStack) {
        if (!posStack) {
          return;
        }

        var newStack = {};

        if (posStack.x) {
          newStack.x = posStack.x;
        }

        if (posStack.y) {
          newStack.y = posStack.y;
        }

        newStack.items = posStack.items.map(item => {
          var newItem = {
            size: item.size,
          };

          if (!promisesBySids[item.sid]) {
            promisesBySids[item.sid] = [];
          }
          promisesBySids[item.sid].push(item => {
            newItem.item_id = item._id;
          });

          return newItem;
        });

        return newStack;
      };

      let processPosStacks = function (stacks) {

        return stacks.map(stack => processPosStack(stack));

      };

      let processRecipe = function (recipe) {

        var newRecipe = {};

        if(recipe.handlerName) {
          newRecipe.handlerName = recipe.handlerName;
        }

        if (recipe.ingredients) {
          newRecipe.ingredients = processPosStacks(recipe.ingredients);
        }

        if (recipe.others) {
          newRecipe.others = processPosStacks(recipe.others);
        }

        if (recipe.result) {
          newRecipe.result = processPosStack(recipe.result);
        }

        return newRecipe;
      };

      var resultRecipe = processRecipe(recipe);

      itemsMongoDb.find({
        sid: {
          $in: Object.keys(promisesBySids)
        }
      }).toArray((err, items) => {

        items.forEach(item => {
          var callbacks = promisesBySids[item.sid];

          if (callbacks) {
            callbacks.forEach(callback => callback(item));
          }

        });

        recipesMongoDb.insert(resultRecipe).then(() => {
          console.log(index)
          index += 1;
          resolve();
        });

      });

    }, () => {
      console.log("Connected successfully to server");
      db.close();
    });

  });
});
