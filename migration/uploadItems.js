var MongoClient = require('mongodb').MongoClient
  , assert = require('assert')
  , Datastore = require('nedb')
  , _ = require('lodash')
  , fs = require('fs');

var url = 'mongodb://crab:aO3UHc81WlkD6lorClka@ds163034.mlab.com:63034/crab';

function base64_encode(file) {
  try {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
  } catch (err) {
    return '';
  }
}

const itemsDb = new Datastore({
  filename: '../data_sets/data/items.db',
  autoload: true
});

const getIconPath = function (item) {
  var nameParts = item.sid.split(':');
  var modName = nameParts[0].replace('|', '_');
  return '../data_sets/data/icons/' + modName + '/' + item.id + '_' + item.meta + '.png';
};

const processItem = function (item) {
  return _.extend(_.pick(item, 'id', 'meta', 'sid', 'name', 'displayName'), {
    icon: base64_encode(getIconPath(item)),
  });
};

const pageSize = 100;

itemsDb.count({}).exec((err, count) => {

  console.log("Items", count);

  let pageCount = Math.ceil(count / pageSize);


  MongoClient.connect(url, function (err, db) {

    assert.equal(null, err);
    let itemsCollection = db.collection('items');

    let promises = [];

    console.log("Pages", pageCount);

    for (let i = 0; i < pageCount; i += 1) {

      let promise = new Promise(function (resolve) {

        itemsDb.find({}).limit(pageSize).skip(i * pageSize).exec((err, documents) => {

          let processedItems = _.map(documents, processItem);

          itemsCollection.insertMany(processedItems, (err, result) => {
            console.log("page done")
            resolve();
          });

        });

      });

      promises.push(promise);
    }

    Promise.all(promises).then(() => {
      console.log("Connected successfully to server");
      db.close();
    });

  });

});

