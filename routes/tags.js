const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const Tags = require('../models/tags');
const Card = require('../models/card');
const logger = require('../external/logger');

const getTagContentFromBody = body => {
    let result = {};
    if (body.id) result.id = body.id;
    if (body.name) result.name = body.name;
    if (body.addedBy) result.addedBy = body.addedBy;
    if (body.deletedBy) result.deletedBy = body.deletedBy;
    return result;
}

// add new tag
router.post('/add', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error("Unauthorized. Card push");
        res.status(401).json({status: 401});
        return;
    }

    let tagContent = getTagContentFromBody(req.body);

    try {
        let result = await Tags.create(tagContent);
        logger.debug("Successfully added new tag to DB. ID: " + result._id);
        res.json({status: 200});
    } catch (err) {
        logger.error("Failed to add new admin to DB");
        res.status(200).json({message: err});
    }
});

// get all tags
router.get('/', async (req, res) => {
    if (!req.user) {
        logger.debug("Unauthorized. TAGS GET");
        res.status(401).json({status: 401});
        return;
    }
    Tags.find({}, function(err, tags) {
        if (err){
            logger.error("Error occured on obtaining TAGS: " + err);
            res.status(200).json({message: err});
        }
        let result = [];
        for (let tag of tags) {
            result.push(Object.assign({}, tag.getJson()));
        }
        logger.debug("Sending TAGS...");
        res.json(result);
    });
});

// make tag deleted by someone
router.delete('/:tagid/by/:initiator', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error(req.user);
        res.status(401).json({status: 401});
        return;
    }

    logger.debug("HERE TRY TO FIND TAG");

    try {
        const tagid = req.params.tagid;
        const initiator = req.params.initiator;

        let result = await Tags.update({id: tagid}, {deletedBy: initiator});
        logger.debug(result);
        logger.debug("Set tag as deleted");
        res.json({status: 200});
    } catch (err) {
        logger.error("Failed set tag as deleted, it used");
        logger.error(err);
        res.status(500).json({status: 500});
    }
});


// delete tag
router.delete('/:id', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error(req.user);
        res.status(401).json({status: 401});
        return;
    }

    logger.debug('START FIND TAG TO DEACTIVATE');

    let findTag = await Tags.findOne({id: req.params.id});

    Card.find({ tags: { "$all" : [findTag.name]}}, function(err, card) {
        if (err){
            logger.error("Error occured on obtaining CARDS: " + err);
            res.status(200).json({message: err});
        }

        if(card.length) {
            logger.debug("HAVE USED TAG " + findTag.name);
            res.status(200).json({allow: false});
        } else {
            logger.debug("HAVE NO USED TAG " + findTag.name);
            res.status(200).json({allow: true});
        }

    });
});

module.exports = router;