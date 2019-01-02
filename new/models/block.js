const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const blockSchema = new mongoose.Schema({
    name: String,
    description: {type: String, default: ''},
    createdBy: String,
    blockOrder: {type: Number, default: 0},
    cards: [
        {
            card: {
                type: Schema.Types.ObjectId,
                ref: 'Card'
            },
            cardOrder: {
                type: Number, default: 0
            },
            active: {
                type: Number, default: 1
            }
        }
    ],
    date: {type: String},
    active: {type: Number, default: 1}
});


module.exports = mongoose.model('Block', blockSchema);