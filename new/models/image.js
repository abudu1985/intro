const mongoose = require('mongoose');
const logger = require('../external/logger');


const imageSchema = new mongoose.Schema({
  type: String,
  content: String
});

imageSchema.statics.createImage = function(base64Image) {
  return new Promise((resolve, reject) => {
    let [type, content] = base64Image.split(',');
    type = type.split(';')[0].split(':')[1];
    logger.debug("Creating new Image instance");
    this.create({type: type, content: content}, (err, inst) => {
      if (err) {
        logger.error("Failed to add image into DB");
        reject("Failed to add image into DB");
      } else {
        logger.info("Successfully added image to DB. ID: " + inst._id);
        resolve(inst._id);
      }
    }
  );
})};

module.exports = mongoose.model('Image', imageSchema);