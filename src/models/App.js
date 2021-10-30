const schema = new require('mongoose').Schema({
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

module.exports = require('mongoose').model('App', schema);