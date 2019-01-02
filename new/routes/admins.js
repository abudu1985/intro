const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const Admins = require('../models/admins');
const logger = require('../external/logger');
const LDAP = require('../external/ldap');
const config = require('../external/config');

const getAdminContentFromBody = body => {
    let result = {};
    if (body.id) result.id = body.id;
    if (body.login) result.login = body.login;
    if (body.addedBy) result.addedBy = body.addedBy;
    if (body.deletedBy) result.deletedBy = body.deletedBy;
    return result;
}

// add new admin
router.post('/add', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error("Unauthorized. Card push");
        res.status(401).json({status: 401});
        return;
    }

    let adminContent = getAdminContentFromBody(req.body);

    try {
        let result = await Admins.create(adminContent);
        logger.debug("Successfully added new admin to DB. ID: " + result._id);
        res.json({status: 200});
    } catch (err) {
        logger.error("Failed to add new admin to DB");
        res.status(500).json({status: 500});
    }
});

// get all admins
router.get('/', async (req, res) => {
    if (!req.user) {
        logger.debug("Unauthorized. Cards get");
        res.status(401).json({status: 401});
        return;
    }
    Admins.find({}, function(err, admins) {
        if (err){
            logger.error("Error occured on obtaining ADMINS: " + err);
            res.status(500).json({status: 500});
        }
        let result = [];
        for (let admin of admins) {
            result.push(Object.assign({}, admin.getJson()));
        }
        logger.debug("Sending ADMINS...");
        res.json(result);
    });
});

// make admine deleted by someone
router.delete('/:adminid/by/:initiator', async (req, res) => {
    if (!req.user || !req.user.admin) {
        logger.error(req.user);
        res.status(401).json({status: 401});
        return;
    }
    try {
        const adminid = req.params.adminid;
        const initiator = req.params.initiator;

        let result = await Admins.update({id: adminid}, {deletedBy: initiator});
        logger.debug(result);
        logger.debug("Set admin as deleted");
        res.json({status: 200});
    } catch (err) {
        logger.error("Failed set admin as deleted");
        logger.error(err);
        res.status(500).json({status: 500});
    }
});

// get all users from ldap
router.get('/get_all_active_users', async (req, res) => {
    if (!req.user) {
        logger.debug("Unauthorized. Cards get");
        res.status(401).json({status: 401});
        return;
    }

    let ldap = new LDAP(
        config.ldap,
        config.ca,
        config.ldapUser,
        config.ldapPass
    );

    let names = await ldap.getAllUsers();

    if(names) {
        res.json(names);
    }
});

module.exports = router;