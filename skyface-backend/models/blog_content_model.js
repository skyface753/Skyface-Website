const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let blogSchema = new Schema({
    for_blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});



module.exports = mongoose.model('BlogContent', blogSchema);