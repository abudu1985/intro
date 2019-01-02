const mongoose = require('mongoose');
const logger = require('../external/logger');
const utils = require('../external/utils');


const adminsSchema = new mongoose.Schema({
    id: String,
    login: String,
    addedBy: String,
    deletedBy: String
});


adminsSchema.methods.getJson = function() {
    let result = {
        id: this.id,
        login: this.login,
        addedBy: this.addedBy,
        deletedBy: this.deletedBy
    };
    return result;
}

module.exports = mongoose.model('Admins', adminsSchema);