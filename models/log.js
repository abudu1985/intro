const mongoose = require('mongoose');
const logger = require('../external/logger');
const utils = require('../external/utils');


const logsSchema = new mongoose.Schema({
    entity: String,
    initiator: String,
    action: String,
    date: String,
    info: String
});


logsSchema.methods.getJson = function () {
    let result = {
        entity: this.entity,
        initiator: this.initiator,
        action: this.action,
        date: this.addedBy,
        info: this.info
    };
    return result;
};

module.exports = mongoose.model('Log', logsSchema);