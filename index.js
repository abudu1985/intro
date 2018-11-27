const logger = require('./external/logger');
logger.level = 'debug';
const config = require('./external/config');
logger.level = config.logLevel;

const express = require('express');
const session = require('express-session');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const cards = require('./routes/cards');
const auth = require('./routes/auth');
const image = require('./routes/image');
const url = require('./routes/url');
const admins = require('./routes/admins');
const blocks = require('./routes/blocks');
const tags = require('./routes/tags');
const logs = require('./routes/logs');



mongoose.Promise = global.Promise;
const app = express();

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(session({
  secret: 'nasdinasidl',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/cards', cards);
app.use('/auth', auth);
app.use('/image', image);
app.use('/url', url);
app.use('/admins', admins);
app.use('/blocks', blocks);
app.use('/tags', tags);
app.use('/logs', logs);

const Card = require('./models/card');



const MONGO_DB = config.mongoDB;
mongoose.connect(MONGO_DB, {
  useMongoClient: true
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.listen(config.port, () => {
  logger.info('App listening on port ' + config.port + '!');
});