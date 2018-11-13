const mongoose = require('mongoose');

const blockNameSchema = new mongoose.Schema({
    blockNames: [{
        type: String
    }]
});

module.exports = mongoose.model('BlockName', blockNameSchema);