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
    try {
      let client = ldap.createClient({
        url: this.host,
        tlsOptions: {
          ca: this.ca,
          rejectUnauthorized: false
        }
      });
      return new Promise((resolve) => {
        client.bind("uid=" + username + ",ou=people,dc=cogniance,dc=com", password, err => {
          //client.unbind();

            client.search("ou=people,dc=cogniance,dc=com", {
                filter: 'uid=' + username,
                scope: 'sub',
                attributes: ['cn']
            },(err,res) => {

                res.on('searchEntry', entry => {
                    logger.debug(entry.object.name);
                });
                res.on('searchReference', referral => {
                    logger.debug('referral: ' + referral.uris.join());
                });
                res.on('error', err => {
                    logger.debug('error: ' + err.message);
                });
                res.on('end', result => {
                    logger.debug(result);
                });
            });

          resolve(err ? false : true);
        });
      });
    } catch (e) {
      logger.error(e);
      logger.debug("Failed when login");
    }
  }

  getUserGroups(username) {
    logger.debug("Get user groups from LDAP")
    let client = ldap.createClient({
      url: this.host,
      tlsOptions: {
        ca: this.ca
      }
    });
    return new Promise((resolve, reject) => {
      client.bind("uid=" + this.managerName + ",ou=people,dc=cogniance,dc=com", this.managerPassword, err => {
        if (err) {
          reject(err);
        } else {
          client.search("ou=group,dc=cogniance,dc=com", {
            filter: 'memberUid=' + username,
            scope: 'sub',
            attributes: ['cn']
          }, (err, res) => {
            let groups = [];
            res.on('searchEntry', function(entry) {
              groups.push(entry.object.cn);
            });
            res.on('end', function(result) {
              client.unbind();
              resolve(groups);
            });
          })
        }
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
            client.bind("uid=" + this.managerName + ",ou=people,dc=cogniance,dc=com", this.managerPassword, err => {
                if (err) {
                    reject(err);
                } else {
                    client.search("ou=people,dc=cogniance,dc=com", {
                        filter: 'memberUid=' + username,
                        scope: 'sub',
                        attributes: ['cn']
                    }, (err, res) => {
                        let creds = [];
                        res.on('searchEntry', function (entry) {
                            creds.push(entry.object.cn);
                        });
                        res.on('end', function (result) {
                            client.unbind();
                            resolve(creds);
                        });
                    })
                }
            });
        });
    }
}

module.exports = LDAP;

