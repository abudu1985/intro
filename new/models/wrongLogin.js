const mongoose = require('mongoose');
const logger = require('../external/logger');
const utils = require('../external/utils');

var wrongLoginSchema = new mongoose.Schema({
    login:{type: String},
    count:{type:Number,default:0}
});


module.exports = mongoose.model('WrongLogin', wrongLoginSchema);