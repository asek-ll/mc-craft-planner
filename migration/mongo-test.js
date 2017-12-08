var MongoClient = require('mongodb').MongoClient
  , assert = require('assert')
  , Datastore = require('nedb')
  , _ = require('lodash')
  , fs = require('fs')
  , util = require('util');

var url = 'mongodb://crab:aO3UHc81WlkD6lorClka@ds163034.mlab.com:63034/crab';


MongoClient.connect(url, function (err, db) {

  assert.equal(null, err);

  var recipesDb = db.collection('recipes');
  var itemsDb = db.collection('items');

  recipesDb.find().skip(100).limit(1).toArray((err, recipes) => {

    console.log(util.inspect(recipes, false, null));

    var itemId = recipes[0].result.items[0].item_id;


    itemsDb.findOne({
      _id: itemId
    }).then(item => {

      console.log(item);
      console.log("Connected successfully to server");
      db.close();

    });

  });


});