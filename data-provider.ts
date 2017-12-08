import {ipcMain} from 'electron';

const log4js = require('log4js');

const Datastore = require('nedb');

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: 'logs/info.log',
    }
  },
  categories: {
    default: {
      appenders: ['file'],
      level: 'info',
    }
  }
});

var logger = log4js.getLogger('file');
logger.level = 'trace';

const databases = [
  'recipes',
  'items',
  'plans',
  'auto-expands',
];

export function initDataStore () {

  var handlers = {};

  var registerHandler = function (requestKey, handler) {
    handlers[requestKey] = handler;
  };

  ipcMain.on('requestData', (event, uid, key, data) => {
    var handler = handlers[key];
    if (handler) {

      handler(data, function (err, result) {
        event.sender.send('requestedData', uid, result);
      });

    } else {
      event.sender.send('requestedData', uid);
    }
  });

  databases.forEach((dbName) => {
    logger.debug('load database', dbName);

    const db = new Datastore({
      filename: './data_sets/data/' + dbName + '.db',
      autoload: true
    });

    registerHandler(dbName + '-find', (data, callback) =>{
      logger.debug('trigger', dbName + '-find', data);

      data.options = data.options || {};

      if (data.name && data.name !== '') {
        data.query.displayName = {
          $regex: new RegExp(data.name, 'i')
        };
      }

      var query = db.find(data.query);

      if (data.limit) {
        query = query.limit(data.limit);
      }
      query.exec(callback);
    });

    logger.debug(dbName + '-find-one');
    registerHandler(dbName + '-find-one', (data, callback) => {
      logger.debug('trigger', dbName + '-find-one', data);
      db.findOne(data.query).exec(callback);
    });

    logger.debug(dbName + '-update');
    registerHandler(dbName + '-update', (data, callback) => {
      logger.debug('trigger', dbName + '-update', data);
      db.update(data.query, data.data, data.options, callback);
    });

    logger.debug(dbName + '-insert');
    registerHandler(dbName + '-insert', (data, callback) => {
      logger.debug('trigger', dbName + '-insert', data);
      db.insert(data.data, callback);
    });

    logger.debug(dbName + '-remove');
    registerHandler(dbName + '-remove', (data, callback) => {
      logger.debug('trigger', dbName + '-remove', data);
      db.remove(data.query, callback);
    });
  });

}
