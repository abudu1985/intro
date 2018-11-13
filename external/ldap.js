const ldap = require('ldapjs');
const fs = require('fs');
const logger = require('./logger');


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
            client.bind("uid=" + username + ",ou=people,dc=cogniance,dc=com", password, err => {
                client.unbind();
                resolve(err ? false : true);
            });
        });
    }


    getUserName(username) {
        logger.debug("Get user NAME from LDAP")
        let client = ldap.createClient({
            url: this.host, //"ldaps://ldap-repl.kyiv.cogniance.com",
            tlsOptions: {
                ca: this.ca,
                rejectUnauthorized: false
            }
        });
        return new Promise((resolve, reject) => {
            client.bind("uid=nssproxy,ou=people,dc=cogniance,dc=com", "hkfLJ7Fi83289fdKyi", err => {
                if (err) {
                    reject(err);
                } else {
                    client.search("ou=people,dc=cogniance,dc=com", {
                        filter: 'uid=' + username,
                        scope: 'sub'
                    }, (err, res) => {
                        let creds = [];
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
}

module.exports = LDAP;

