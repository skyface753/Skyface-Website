const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    // content: { // ECMA Script | UTF-8
    //     type: String,
    //     required: true
    // },
    posted_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categories: {
        type: Schema.Types.ObjectId,
        ref: 'BlogCategory'
    },
    url: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);