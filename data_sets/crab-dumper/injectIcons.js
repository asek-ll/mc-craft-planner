var Datastore = require('nedb'),
  _ = require('lodash'),
  fs = require('fs');

function base64_encode(file) {
  try {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
  } catch (err) {
    return '';
  }
}

const itemsDb = new Datastore({
  filename: '../data/items.db',
  autoload: true
});

const getIconPath = function(item) {
  var nameParts = item.sid.split(':');
  var modName = nameParts[0].replace('|', '_');
  var path = '../data/icons/' + modName + '/' + item.id;
  if (nameParts.length > 2) {
    path += '_' + nameParts[2];
  }
  return path + '.png';
};

itemsDb.find({}).exec((err, documents) => {

  let promises = documents.map(document => {
    let iconContent = base64_encode(getIconPath(document));

    return new Promise(resolve => {
      itemsDb.update({
        _id: document._id
      }, {
        $set: {
          icon: iconContent
        }
      }, (err, updated) => {
        console.log('update', updated)
        resolve();
      });
    });
  });

  Promise.all(promises).then(() => {
    itemsDb.persistence.compactDatafile();

    // itemsDb.ensureIndex({
    //   fieldName: 'sid',
    //   unique: true,
    // });
  });

});
