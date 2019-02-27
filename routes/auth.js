const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const request = require('request-promise-native');

const logger = require('../external/logger');
const TokenStorage = require('../external/token-storage');
const UserCooling = require('../external/user-cooling');
const LDAP = require('../external/ldap');
const config = require('../external/config');


const tokenStorage = new TokenStorage();
const userCooling = new UserCooling();
const Admins = require('../models/admins');
const WrongLogin = require('../models/wrongLogin')


passport.serializeUser(function(user, done) {
  done(null, user.token);
});

passport.deserializeUser(function(token, done) {
  logger.debug("Token from request: " + token);
  let info = tokenStorage.getInfo(token);
  if (info) {
    done(null, info);
  } else {
    done(null, false);
  }
});

passport.use(new LocalStrategy({
    session: true
  },
  async (username, password, done) => {
    if (!userCooling.canLogin(username)) {
      done("To many attempts to login", false);
      return;
    }
    if (config.additionalAdminLogin && config.additionalAdminPassword) {
      if (username === config.additionalAdminLogin && password === config.additionalAdminPassword) {
        done(null, {token: await tokenStorage.create(true, 3600 * 1000), admin: true});
        return;
      }
    }
    // let ldap = new LDAP(
    //   config.ldap,
    //   config.ca,
    //   config.ldapUser,
    //   config.ldapPass
    // );
    try {
      // let loggedIn = await ldap.checkLogin(username, password);
      // if (!loggedIn) {
      //
      //     WrongLogin.findOneAndUpdate({ login: username },
      //         { $inc: { count: 1 } },
      //         {upsert: true, new: true },
      //         function(err, response) {
      //         if (err) {
      //             logger.error(err);
      //         } else {
      //             logger.debug(response);
      //         }
      //     });
      //
      //   logger.debug("Failed to login! Wrong credentials");
      //   done(null, false, {message: 'Incorrect login or password'});
      //   return;
      // } else {
      //     WrongLogin.findOneAndRemove({login: username}, function(err, response){
      //         if (err) {
      //             logger.error(err);
      //         } else {
      //             logger.debug(response);
      //         }
      //     });
      // }

        const isDeletedAdmin = (data) => {
            if (data) { return true; }
            return false
        };

        let admin = false;
        let admins = await Admins.find();
        let result = [];
        for (let admin of admins) {
            result.push(Object.assign({}, admin.getJson()));
        }
        logger.debug("pic all valid ADMINS...");
        const validAdmins = result.filter(function(el) {
            return !isDeletedAdmin(el.deletedBy);
        });

        let name = 'me'; //await ldap.getUserName(username);

        logger.debug("TRY SHOW FULL NAME...");
        logger.debug(name);

        if(config.adminLogin === username){ admin = true; }
        if(isDeletedAdmin(validAdmins.find(obj => obj.login === username))){ admin = true; }

      done(null, {token: await tokenStorage.create(admin), admin: admin, displayName: name});
    } catch (e) {
      logger.error(e);
      done(e, false);
    }
  }
));

router.post('/login',
  async (req, res, next) => {
    logger.debug("Verifying recaptcha");
      logger.debug(req.body);
    let captchaValid = false;
    if (req.body.captcha && req.body.captcha !== "") {
      try {
        let response = await request.post("https://www.google.com/recaptcha/api/siteverify")
          .form({secret: config.recaptchaSecretKey, response: req.body.captcha});
        captchaValid = JSON.parse(response).success;
        if (!captchaValid) {
          logger.debug("Failed captcha validation");
        }
      } catch (e) {
        logger.error("Google reCAPTCHA check error!");
        logger.error(e);
      }

        if (captchaValid) {
            next();
        } else {
            res.status(401);
            res.send("");
        }
    } else {
        next();
    }
  },
  passport.authenticate('local'),
  (req, res) => {
    logger.debug("Logging in");
      logger.debug(req);
    let response = {};
    if (req.user) {
      response.admin = req.user.admin;
    }
    response['displayName'] = req.user.displayName;
    res.json(response);
});

router.get('/login', (req, res) => {
  logger.debug("Check user login");
  if (req.user) {
    let response = {};
    if (req.user.admin) {
      response['admin'] = true;
    }
    res.json(response);
  } else {
    res.status(401);
    res.send("");
  }
})


router.get('/logout', (req, res) => {
  if (req.user && req.user.token) {
    tokenStorage.delete(req.user.token);
  }
  req.logout();
  res.redirect('/');
})


// check if user can login without recaptcha
router.get('/check_count/:username', async (req, res) => {

    const login = req.params.username;
    WrongLogin.findOne({login: login}, function(err, doc) {
        if (err){
            logger.error("ERROR WHEN GET COUNT OF WRONG LOGINS FOR... " + login);
        }
        let response = {};
        if (doc.count > config.wrong_login_attempts) {
            response['show_recaptcha'] = true;
        } else {
            response['show_recaptcha'] = false;
        }
       logger.debug("SEND IS TO SHOW RECAPTCH... ?");
       res.json(response);
    });
});

module.exports = router;