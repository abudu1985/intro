const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const Card = require('../models/card');
const Image = require('../models/image');
const logger = require('../external/logger');


router.get('/:id', async (req, res) => {
  try {
    let image = await Image.findOne({_id: req.params.id});
    if (!image) {
      logger.error("Can't find image " + req.params.id);
      res.status(404).json({status: 404});
    } else {
      let img = new Buffer(image.content, 'base64');
      logger.debug("Image found " + req.params.id);
      res.writeHead(200, {
          'Content-Type': image.type,
          'Content-Length': img.length
      });
      res.end(img);
    }
  } catch (err) {
    logger.error("Error occured: " + err);
    res.status(500).json({status: 500});
    return;
  }
});

module.exports = router;