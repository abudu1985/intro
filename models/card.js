const mongoose = require('mongoose');
const logger = require('../external/logger');
const utils = require('../external/utils');


const cardSchema = new mongoose.Schema({
  title: String,
  description: String,
  pic: String,
  url: {type: String, default: 'https://cogniance.com'},
  counter: {type: Number, default: 0},
  currentPeriod: {type: Number, default: utils.periodInfo.fullPeriod},
  previousPeriodCounter: {type: Number, default: 0},
  tags: [{type: String}]
});

cardSchema.methods.getJson = function() {
  let result = {
    title: this.title,
    description: this.description,
    pic: this.pic,
    rating: this.counter + this.previousPeriodCounter * (1 - utils.periodInfo().remainder / 30),
    id: this._id,
    tags: this.tags
  };
  return result;
};

cardSchema.methods.updateHistory = function(callback) {
  return new Promise((resolve, reject) => {
    if (utils.periodInfo().fullPeriod - this.currentPeriod !== 0) {
      this.previousPeriodCounter = this.counter;
      this.currentPeriod = utils.periodInfo().fullPeriod;
      this.counter = 0;
      this.save((err) => {
        if (err) {
          logger.error("Can't update history info for card");
          reject(err);
        } else {
          resolve(true);
        }
      });
    } else {
      resolve(true);
    }
  });
}

cardSchema.methods.addClick = function() {
  return new Promise ((resolve, reject) => {
    this.counter++;
    this.save((err) => {
      if (err) {
        logger.error("Can't save click information");
        logger.error(err);
        reject(err);
      } else {
        logger.debug("Saved click data");
        resolve(true);
      }
    });
  });
}

module.exports = mongoose.model('Card', cardSchema);