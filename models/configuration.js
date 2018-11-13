const mongoose = require('mongoose');
const logger = require('../external/logger');


const configurationSchema = new mongoose.Schema({
  key: String,
  value: String
});

configurationSchema.static.addConfig = function(key, value) {
  return new Promise((resolve, reject) => {
    this.findOneAndUpdate(
      {key: key},
      {key: key, value: value},
      {new: true, upsert: true},
      (err, doc) => {
        if (err) {
          logger.error("Failed to update config field: " + key);
          logger.error("Error: " + err);
          reject(err);
          return;
        }

        logger.debug("Updated config field: " + key);
        resolve();
      })
  });
}

configurationSchema.static.getConfig = function(key) {
  return new Promise((resolve, reject) => {
    this.findOne({key: key}, (err, doc) => {
      if (err) {
        logger.error("Failed to get config field: " + key);
        logger.error("Error: " + err);
        reject(err);
        return;
      }

      logger.debug("Returning config field: " + key);
      resolve(doc.value);
    })
  })
}

module.exports = mongoose.model('Configuration', configurationSchema);