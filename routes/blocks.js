const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const logger = require('../external/logger');
const Block = require('../models/block');



const getBlockContentFromBody = body => {
    let result = {};
    if (body.name) result.name = body.name;
    if (body.description) result.description = body.description;
    if (body.createdBy) result.createdBy = body.createdBy;
    if (body.date) result.date = body.date;
    return result;
}

// add new block name
router.post('/add', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error("Unauthorized. Card push");
        res.status(401).json({status: 401});
        return;
    }

    let blockContent = getBlockContentFromBody(req.body);

    blockContent.blockOrder = await Block.count({});

    try {
        let result = await Block.create(blockContent);
        logger.debug("Successfully added block to DB. ID: " + result._id);
        res.json({status: 200});
    } catch (err) {
        logger.error("Failed to add block to DB");
        res.status(500).json({status: 500});
    }
});


// delete block
router.delete('/:id', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error(req.user);
        res.status(401).json({status: 401});
        return;
    }

    logger.debug('START FIND BLOCK TO DEACTIVATE');

    Block.findOne({_id: req.params.id})
        .then(block => {
            if (block.cards.length > 0) {
                res.status(200).json({allow: false});
            } else {
                block.active = 0;
                block.save().then(block => {
                    logger.debug( block.name + " DEACTIVATED NOW");
                    res.status(200).json({allow: true})
                });
            }
        })
        .catch(err => {
            logger.error(err);
            res.status(200).json({message: err})
        });
});


// update block cards will receive (req.body.blockId, req.body.deletedCardsId, req.body.addCard)
router.post('/update_cards', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error("Unauthorized. Card push");
        res.status(401).json({status: 401});
        return;
    }

    logger.debug('START FIND BLOCK TO UPDATE CARDS');
    logger.debug(req.body);

    if (req.body.addCard && req.body.addCard !== "") {
        Block.findOne({_id: req.body.blockId})
            .then(block => {

                let cardOrder = 0;
                if (block.cards.length > 0) {
                    cardOrder = block.cards.length;
                }

                // Add card id and card order to cards array
                block.cards.unshift({card: req.body.addCard, cardOrder: cardOrder});
                block.save().then(block => {
                    logger.debug("SAVE CARD ID TO CARDS ARRAY INSIDE BLOCK");
                });
            })
            .catch(err => {
                logger.error(err);
                res.status(500).json({status: 500})
            });
    }

    if (req.body.deletedCardsId && req.body.deletedCardsId !== "") {

        Block.update({_id: req.body.blockId, "cards.card": { $in: req.body.deletedCardsId }},
            {$set: {"cards.$.active": 0}}, { multi: true }, function (error, blocks) {
                if (error) {
                    logger.error('UPDATE BLOCK CARDS STATUS ERROR');
                    logger.error(error);
                    //res.json({message: error});
                } else {
                    logger.debug('POSITION REORDER CARD UPDATE');
                    logger.debug(blocks);
                }
            });
    }

    res.status(200).json({status: 200})
});


// update block will receive (req.body.newName, req.body.newDescription)
router.post('/update/:index', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error("Unauthorized. Card push");
        res.status(401).json({status: 401});
        return;
    }

    logger.debug('START FIND BLOCK TO UPDATE');
    logger.debug(req.body);

    Block.findByIdAndUpdate(req.params.index, { $set: { name: req.body.newName, description: req.body.newDescription }}, {}, function (error, thank) {
        if (error) {
            logger.error('UPDATE BLOCK ERROR');
            logger.error(error);
            res.json({message: error});
        } else {
            logger.debug('UPDATE BLOCK DONE');
            res.json({status: 200});
        }
    });
});


module.exports = router;
