const mongoose = require('mongoose');
const logger = require('../external/logger');
const utils = require('../external/utils');


const tagsSchema = new mongoose.Schema({
    id: String,
    name: String,
    addedBy: String,
    deletedBy: String
});


tagsSchema.methods.getJson = function() {
    let result = {
        id: this.id,
        name: this.name,
        addedBy: this.addedBy,
        deletedBy: this.deletedBy
    };
    return result;
}

module.exports = mongoose.model('Tags', tagsSchema);