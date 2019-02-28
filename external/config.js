const logger = require('./logger');

let config = {
  ldapUser: 'nssproxy',
  ldapPass: 'hkfLJ7Fi83289fdKyi',
  logLevel: 'debug',
  mongoDB: 'mongodb://igor:1Q2w3e4r!@ds233323.mlab.com:33323/devconnector', //'mongodb://127.0.0.1/introcogniance', //cgnintro',
  ldap: 'ldaps://ldaps.cogniance.com:636',
  port: 3000,
  ca: '/etc/ssl/certs/rootca.crt',
  additionalAdminLogin: '',
  additionalAdminPassword: '',
  recaptchaSecretKey: '6Le1aiwUAAAAAAGSXfvoggcVdJe9ySglRjh1ZRSR',
  adminLogin: 'iluchko',
  wrong_login_attempts: 5,
  ldapDC: 'ou=people,dc=cogniance,dc=com'
};

try {
  config = Object.assign(config, require('../cgnintro.json'));
  logger.info("Loaded /etc/cgnintro.json");
} catch (err) {
  logger.error("Can't find /etc/cgnintro.json");
}

if (!config.recaptchaSecretKey) {
  logger.error("Failed to load recaptcha key. Please add it to config");
}

// type in console:  node index prod or  node index dev
let env = process.argv[2] || 'dev';
switch (env) {
    case 'dev':
        logger.info('its dev env');
        break;
    case 'prod':
        logger.info('its prod env');
        break;
}


module.exports = config;