const express = require('express');
const crypto = require('crypto');
const logger = require('../external/logger');
const router = express.Router();
const Log = require('../models/log');

const getLogContentFromBody = body => {
    let result = {};
    if (body.entity) result.entity = body.entity;
    if (body.initiator) result.initiator = body.initiator;
    if (body.action) result.action = body.action;
    if (body.date) result.date = body.date;
    if (body.info) result.info = body.info;
    return result;
};

router.post('/add', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error("Unauthorized. Do log");
        res.status(401).json({status: 401});
        return;
    }

    let logContent = getLogContentFromBody(req.body);
    logger.debug(logContent);


    try {
        let result = await Log.create(logContent);
        logger.debug("Successfully added new log to DB. ID: " + result._id);
        res.json({status: 200, message: "ok"});
    } catch (err) {
        logger.error("Failed to add new log to DB");
        res.status(201).json({message: err});
    }
});

router.get('/', async (req, res) => {
    if (!req.user) {
        logger.debug("Unauthorized. Logs get");
        res.status(401).json({status: 401, message: "Unauthorized. Logs get"});
        return;
    }

    Log.find()
        .then(logs => {
            logger.debug("Sending LOGS...");
            res.json(logs);
        })
        .catch(err => {
            logger.error(err);
            res.status(201).json({status: 201, message: err})
        });
});

module.exports = router;