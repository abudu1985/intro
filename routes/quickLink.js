const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const mongoose = require('mongoose');

const QuickLink = require('../models/quickLink');
const logger = require('../external/logger');


router.get('/', async (req, res) => {
    if (!req.user) {
        logger.debug("Unauthorized. QuickLinks get")
        res.status(401).json({status: 401});
        return;
    }

        QuickLink.find()
            .then(quick_links => {
                if(!quick_links.length) {
                    logger.debug('EMPTY QUICK LINK');

                    const newQuickLink = new QuickLink({
                        name: 'QuickLinks',
                        description: 'Here we can add links that will be show at the top.'
                    });

                    newQuickLink.save().then(newLinks =>
                        res.json(newLinks)
                    );
                    logger.debug("Successfully added QuickLink to DB");

                } else {
                    logger.debug('NOT EMPTY QUICK LINK');
                    logger.debug("Sending QuickLinks...");
                    res.json(quick_links);
                }
            })
            .catch(err => {
                logger.error(err);
                res.status(201).json({status:(201), message: err})
            });
});


router.post('/update_cards', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error("Unauthorized. Card push");
        res.status(401).json({status: 401});
        return;
    }

    logger.debug(req.body);

    // {"quickLinkId":"5c07c765b5b99c3720791186","deletedCardsId":["5be429ed5c11432480bc538b","5be3f138f96f081dc77b67f3"],"addCard":"5be95574325dc62e76e2a4c9","info":"add: more122"}


    if (req.body.addCard && req.body.addCard !== "") {

        QuickLink.findOne({_id: req.body.quickLinkId})
            .then(quickLinks => {

                let linkOrder = 0;
                if (quickLinks.cards.length > 0) {
                    linkOrder = quickLinks.cards.length;
                }

                // Add card id and card order to cards array
                quickLinks.cards.unshift({card: req.body.addCard, linkOrder: linkOrder});
                quickLinks.save().then(block => {
                    logger.debug("SAVE CARD ID TO CARDS ARRAY INSIDE QUICK LINKS");
                });
            })
            .catch(err => {
                logger.error(err);
                res.status(201).json({status: 201, message: err})
            });

    }


    if (req.body.deletedCardsId && req.body.deletedCardsId !== "") {

        req.body.deletedCardsId.forEach(function (id, index, arr) {
            QuickLink.update({_id: req.body.quickLinkId, "cards.card": {$in: [id]}},
                {$set: {"cards.$.active": 0}}, {multi: true}, function (error, links) {
                    if (error) {
                        logger.error('UPDATE BLOCK CARDS STATUS ERROR');
                        logger.error(error);
                        res.status(201).json({status: 201, message: error})
                    } else {
                        logger.debug('POSITION REORDER CARD UPDATE');
                        logger.debug(links);
                    }
                });
        });
    }
    // setTimeout(() => {
    //     res.status(200).json({status: 200})
    // }, 600)

    res.status(200).json({status: 200})

});

// reorder cards
router.post('/cards_reorder', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error("Unauthorized. Card push");
        res.status(401).json({status: 401});
        return;
    }

    QuickLink.find({"_id": req.body.quickLinkId}).lean().exec(function (err, links) {
        let initOrder = '';
        let posOrder = '';

        let arr = JSON.parse(JSON.stringify(links));

        arr.forEach(function (obj) {
            obj.cards.forEach(function (a) {
                if (a.card === req.body.initId && a.active === 1) {
                    initOrder = a.linkOrder;
                }
                if (a.card === req.body.posId && a.active === 1) {
                    posOrder = a.linkOrder;
                }
            })
        });

        QuickLink.update({"_id": req.body.quickLinkId, "cards.card": req.body.initId},
            {$set: {"cards.$.linkOrder": posOrder}}, function (error, links) {
                if (error) {
                    logger.error('REORDER QUICK LINKS CARD UPDATE ERROR');
                    logger.error(error);
                    res.json({message: error});
                } else {
                    logger.debug('INITIATOR REORDER CARD UPDATE');
                }
            });

        QuickLink.update({_id: req.body.quickLinkId, "cards.card": req.body.posId},
            {$set: {"cards.$.linkOrder": initOrder}}, function (error, links) {
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

module.exports = router;