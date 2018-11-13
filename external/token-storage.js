const crypto = require('crypto');
const logger = require('./logger');


class TokenStorage {
  constructor() {
    this.tokenStorage = {};

  }

  _generateToken() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if(err) reject(err);
        let token = buf.toString('hex');
        resolve(token);
      })
    })
  }

  async create(admin, ttl=1000 * 3600 * 24 * 7) {
    logger.debug("Creating new token");
    try {
      var token = await this._generateToken();
    } catch (e) {
      logger.error(e);
      throw "Can't generate token";
    }
    // Almost impossible situation of token duplication. Just try once more
    if (this.tokenStorage[token]) {
      return await this.createToken(admin, ttl);
    }

    this.tokenStorage[token] = {
      admin: admin ? true : false,
      timeout: setTimeout(() => {
        logger.debug('Remove token: ' + token);
        delete this.tokenStorage[token];
      }, ttl)
    }
    return token;
  }

  getInfo(token) {
    logger.debug('Obtaining token information');
    if (this.tokenStorage[token]) {
      logger.debug('Token was found');
      return Object.assign({}, {admin: this.tokenStorage[token].admin, token: token});
    }

    return null;
  }

  delete(token) {
    if (this.tokenStorage[token]) {
      clearTimeout(this.tokenStorage[token].timeout);
      delete this.tokenStorage[token];
    }
  }
}


module.exports = TokenStorage;
