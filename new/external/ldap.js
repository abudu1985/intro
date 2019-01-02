const ldap = require('ldapjs');
const fs = require('fs');
const logger = require('./logger');
const config = require('../external/config');


class LDAP {
    constructor(host, ca, managerName, managerPassword) {
        this.host = host;
        this.ca = fs.readFileSync(ca);
        this.managerName = managerName;
        this.managerPassword = managerPassword;
    }

    checkLogin(username, password) {
        logger.debug("Check credentials in LDAP");
        let client = ldap.createClient({
            url: this.host,
            tlsOptions: {
                ca: this.ca,
                rejectUnauthorized: false
            }
        });
        return new Promise((resolve) => {
            client.bind("uid=" + username + "," + config.ldapDC, password, err => {
                client.unbind();
                resolve(err ? false : true);
            });
        });
    }


    getUserName(username) {
        logger.debug("Get user NAME from LDAP")
        let client = ldap.createClient({
            url: this.host,
            tlsOptions: {
                ca: this.ca,
                rejectUnauthorized: false
            }
        });
        return new Promise((resolve, reject) => {
            client.bind("uid=" + this.managerName + "," + config.ldapDC, this.managerPassword, err => {
                if (err) {
                    reject(err);
                } else {
                    client.search(config.ldapDC, {
                        filter: 'uid=' + username,
                        scope: 'sub'
                    }, (err, res) => {
                        res.on('searchEntry', function (entry) {

                            logger.debug(entry.object.displayName);
                            client.unbind();
                            resolve(entry.object.displayName);
                        });
                    })
                }
            });
        });
    }

    getAllUsers() {
        logger.debug("Get ALL USERS from LDAP");
        let client = ldap.createClient({
            url: this.host,
            tlsOptions: {
                ca: this.ca,
                rejectUnauthorized: false
            }
        });

        let matchedUsers = [];

        return new Promise((resolve, reject) => {
            client.bind("uid=" + this.managerName + "," + config.ldapDC, this.managerPassword, err => {
                if (err) {
                    logger.error('ERROR WHEN GET ALL USERS FROM LDAP');
                    reject(err);
                } else {
                    client.search(config.ldapDC, {
                        filter: 'loginShell=/bin/bash', // that should fit for all users
                        scope: 'sub'
                    }, (err, res) => {
                        res.on('searchEntry', function (entry) {
                            matchedUsers.push(entry.object.uid);
                        });

                        res.on('end', function(result) {
                            if (matchedUsers.length) { //if any match was found.
                                client.unbind();
                                resolve(matchedUsers);
                            }
                        });
                    })
                }
            });
        });
    }
}

module.exports = LDAP;

