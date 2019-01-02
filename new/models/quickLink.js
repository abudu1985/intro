const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const quickLinkSchema = new mongoose.Schema({
    name: {type: String, default: 'QuickLinks'},
    description: {type: String, default: 'Here we can add links that will be show at the top.'},
    cards: [
        {
            card: {
                type: Schema.Types.ObjectId,
                ref: 'Card'
            },
            linkOrder: {
                type: Number, default: 0
            },
            active: {
                type: Number, default: 1
            }
        }
    ],
    date: {type: String},
});


module.exports = mongoose.model('QuickLink', quickLinkSchema);