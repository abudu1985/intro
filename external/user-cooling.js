const crypto = require('crypto');
const logger = require('./logger');


class UserCooling {
  constructor() {
    this.userCooling = new Set();

  }

  canLogin(username) {
    if (this.userCooling.has(username)) {
      return false;
    }
    this.userCooling.add(username);
    setTimeout(() => {
      this.userCooling.delete(username);
      logger.debug('Username ' + username + ' is able to try login once more');
    }, 300); // 3000
    return true;
  }
}


module.exports = UserCooling;
