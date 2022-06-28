const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    links: [
        {
            text: String,
            href: String
        }
    ],
    text: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', ProjectSchema);

