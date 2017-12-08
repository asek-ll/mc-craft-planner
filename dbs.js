const ipcMain = require('electron').ipcMain;
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

module.exports = function () {

  var handlers = {};

  var registerHandler = (requestKey, handler) => {
    handlers[requestKey] = handler;
  };

  ipcMain.on('requestData', (event, uid, key, data) => {
    var handler = handlers[key];
    if (handler) {

      handler(data, (err, result) => {
        event.sender.send('requestedData', uid, result);
      });

    } else {
      event.sender.send('requestedData', uid);
    }
  });


  var prepareQuery = (query) => {
    if (!query) {
      return query;
    }

    Object.keys(query).forEach( (key) => {
      var params = query[key];
      if (params.hasOwnProperty('$regex')) {
        var $regex = params['$regex'];
        var regexParams = $regex;
        if (typeof $regex === 'string') {
          regexParams = {
            pattern: $regex
          };
        }

        params['$regex'] = new RegExp(regexParams.pattern, regexParams.flags || '');
      }
    });

    return query;
  };

  databases.forEach((dbName) => {
    logger.debug('load database', dbName);
    const db = new Datastore({
      filename: './data_sets/data/' + dbName + '.db',
      autoload: true,
      // inMemoryOnly: dbName === 'items',
    });

    // if (dbName === 'items') {
    //   db.ensureIndex({
    //     fieldName: 'sid',
    //     unique: true,
    //   });
    // }

    registerHandler(dbName + '-find', (data, callback) => {
      logger.debug('trigger', dbName + '-find', data);

      var query = db.find(prepareQuery(data.query));

      if (data.limit) {
        query = query.limit(data.limit);
      }

      if(data.skip) {
        query = query.skip(data.skip);
      }

      query.exec(callback);
    });

    logger.debug(dbName + '-find-one');
    registerHandler(dbName + '-find-one', (data, callback) => {
      logger.debug('trigger', dbName + '-find-one', data);
      db.findOne(prepareQuery(data.query)).exec(callback);
    });

    logger.debug(dbName + '-update');
    registerHandler(dbName + '-update', (data, callback) => {
      logger.debug('trigger', dbName + '-update', data);
      db.update(prepareQuery(data.query), data.data, data.options, callback);
    });

    logger.debug(dbName + '-insert');
    registerHandler(dbName + '-insert', (data, callback) => {
      logger.debug('trigger', dbName + '-insert', data);
      db.insert(data.data, callback);
    });

    logger.debug(dbName + '-remove');
    registerHandler(dbName + '-remove', (data, callback) => {
      logger.debug('trigger', dbName + '-remove', data);
      db.remove(prepareQuery(data.query), callback);
    });

    logger.debug(dbName + '-count');
    registerHandler(dbName + '-count', (data, callback) => {
      logger.debug('trigger', dbName + '-count', data);
      db.count(prepareQuery(data.query), callback);
    });
  });

};
