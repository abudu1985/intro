const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const Card = require('../models/card');
const Image = require('../models/image');
const logger = require('../external/logger');
const Block = require('../models/block');
const QuickLink = require('../models/quickLink');


const getCardContentFromBody = body => {
  let result = {};
  if (body.title) result.title = body.title;
  if (body.description) result.description = body.description;
  if (body.url) result.url = body.url;
  if (body.pic) result.pic = body.pic;
  if (body.tags) result.tags = body.tags;
  return result;
};

router.get('/', async (req, res) => {
  if (!req.user) {
    logger.debug("Unauthorized. Cards get")
    res.status(401).json({status: 401});
    return;
  }

  try {
    let cards = await Card.find().sort({counter: -1});
    let result = [];
    for (let card of cards) {
      await card.updateHistory();
      result.push(Object.assign({}, card.getJson(), {
        url: (req.user.admin ? card.url : '/url/' + card._id),
        pic: (card.pic ? '/image/' + card.pic : '')
      }));
    }
    logger.debug("Sending cards list");
    res.json(result);
  } catch (err) {
    logger.error("Error occured on obtaining cards: " + err);
    res.status(500).json({status: 500});
  }
});

router.post('/', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error("Unauthorized. Card push");
        res.status(401).json({status: 401});
        return;
    }

    let cardContent = getCardContentFromBody(req.body);
    if (cardContent.pic) {
        try {
            var pictureID = await Image.createImage(cardContent.pic);
            cardContent.pic = pictureID;
        } catch (e) {
            logger.error("Failed to process image. Just remove it");
            logger.error(e);
            delete cardContent.pic;
        }
    }

    try {
        let result = await Card.create(cardContent);
        logger.debug("Successfully added card to DB. ID: " + result._id);
        res.json({status: 200});
    } catch (err) {
        logger.error("Failed to add card to DB");
        res.status(500).json({status: 500});
    }
});

router.get('/blocks', async (req, res) => {
    if (!req.user) {
        logger.debug("Unauthorized. Cards get")
        res.status(401).json({status: 401});
        return;
    }

    Block.find()
        .populate('cards')
        .then(blocks => {
            logger.debug("Sending BLOCKS...");
            res.json(blocks);
        })
        .catch(err => {
            logger.error(err);
            res.status(500).json({status: 500, message: err})
        });
});

router.delete('/:cardid', async (req, res) => {
  if (!req.user || !req.user.admin) {
    logger.error(req.user);
    res.status(401).json({status: 401});
    return;
  }

  try {
    let result = await Card.findByIdAndRemove(req.params.cardid);
    logger.debug("Removed card. ID: " + result._id);
    if (result.pic) {
      result = await Image.findByIdAndRemove(result.pic);
      logger.debug("Removed picture. ID: " + result._id);
    }
    res.json({status: 200});
  } catch (err) {
    logger.error("Failed to delet card");
    logger.error(err);
    res.status(500).json({status: 500});
  }
});


// try_delete - check if it used in blocks or quick links
router.delete('/try_delete/:cardid', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error(req.user);
        res.status(401).json({status: 401});
        return;
    }

    let a = req.params.cardid;
    logger.debug("TRY FIND CARD INSIDE BLOCKS" + a);

    let findInB = await Block.find({ cards: { $elemMatch: { card: a, active: 1 }}});
    let findInQl = await QuickLink.find({ cards: { $elemMatch: { card: a, active: 1 }}});

    if(findInB.length) {
        logger.debug("HAVE USED CARD IN BLOCK " + a);
        res.status(200).json({allow: false, entity: 'Block'});
    } else if(findInQl.length) {
        logger.debug("HAVE USED CARD IN QUICK LINKS " + a);
        res.status(200).json({allow: false, entity: 'Quick Links'});
    } else {
        logger.debug("HAVE NO USED CARD " + a);
        res.status(200).json({allow: true});
    }
});

// reorder block names
router.post('/block_names_reorder', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error("Unauthorized. Card push");
        res.status(401).json({status: 401});
        return;
    }

    Block.update({ _id: req.body.initId }, { $set: { blockOrder: req.body.posOrder }}, function (error, blocks) {
        if (error) {
            logger.error('REORDER UPDATE ERROR');
            logger.error(error);
            res.json({message: error});
        } else {
            logger.debug('REORDER UPDATE FOR INITIATOR');
            logger.debug(blocks);
        }
    });

    Block.update({ _id: req.body.posId }, { $set: { blockOrder: req.body.initOrder }}, function (error, blocks) {
        if (error) {
            logger.error('REORDER UPDATE ERROR');
            logger.error(error);
            res.json({message: error});
        } else {
            logger.debug('REORDER UPDATE FOR POSITION');
            logger.debug(blocks);
        }
    });
    res.json({status: 200});
});

// reorder cards
router.post('/cards_reorder', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error("Unauthorized. Card push");
        res.status(401).json({status: 401});
        return;
    }

    Block.find({"_id": req.body.blockId}).lean().exec(function (err, blocks) {
        let initOrder = '';
        let posOrder = '';

        let arr = JSON.parse(JSON.stringify(blocks));

        arr.forEach(function (obj) {
            obj.cards.forEach(function (a) {
                if (a.card === req.body.initId && a.active === 1) {
                    initOrder = a.cardOrder;
                }
                if (a.card === req.body.posId && a.active === 1) {
                    posOrder = a.cardOrder;
                }
            })
        });

        Block.update({"_id": req.body.blockId, "cards.card": req.body.initId},
            {$set: {"cards.$.cardOrder": posOrder}}, function (error, links) {
                if (error) {
                    logger.error('REORDER QUICK LINKS CARD UPDATE ERROR');
                    logger.error(error);
                    res.json({message: error});
                } else {
                    logger.debug('INITIATOR REORDER CARD UPDATE');
                }
            });

        Block.update({_id: req.body.blockId, "cards.card": req.body.posId},
            {$set: {"cards.$.cardOrder": initOrder}}, function (error, links) {
                if (error) {
                    logger.error('POSITION REORDER CARD UPDATE ERROR');
                    logger.error(error);
                    res.json({message: error});
                } else {
                    logger.debug('POSITION REORDER CARD UPDATE');
                }
            });
        res.json({status: 200});
    });
});


router.post('/:cardid', async (req, res) => {
  if (!req.user || !req.user.admin) {
    logger.error("Unauthorized. Card update");
    res.status(401).json({status: 401});
    return;
  }

  let cardContent = getCardContentFromBody(req.body);
  if (cardContent.pic) {
    try {
      let pictureID = await Image.createImage(cardContent.pic);
      cardContent.pic = pictureID;
    } catch (err) {
      logger.error("Failed to process image. Just remove it");
      logger.error(err);
      delete cardContent.pic;
    }
  }

  try {
    let result = await Card.findByIdAndUpdate(req.params.cardid, cardContent);
    logger.debug("Updated card. ID: " + result._id);
    res.json({status: 200});
  } catch (err) {
    logger.error("Failed to update card info.");
    logger.error(err);
    res.status(201).json({status: 201, message: err});
  }
});

module.exports = router;