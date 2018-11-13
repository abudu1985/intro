const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const Card = require('../models/card');
const logger = require('../external/logger');


router.get('/:id', async (req, res) => {
  if (!req.user) {
    logger.error("Unauthorized. URL get")
    res.status(401).json({status: 401});
    return;
  }
  let card = await Card.findById(req.params.id);
  if (card) {
    await card.addClick();
    res.redirect(card.url);
  } else {
    res.status(404).json({status: 404});
  }
});

module.exports = router;