const { Schema } = require('mongoose');
const { model } = require('mongoose');

const appSchema = new Schema({
    name: String,
    download: String,
    logo: String,
    version: String,
    shortDescription: String,
    longDescription: String,
    likes: Number,
    dislikes: Number,
    author: String,
    authorId: String,
    compatibility: String,
    language: String,
    maturityRating: String,
    category: String,
    reviews: Array
});

module.exports = model('App', appSchema);