const schema = require('mongoose').Schema({
    name: String,
    download: String,
    version: String,
    description: String,
    rating: Number,
    author: String,
    compatibility: String,
    language: String,
    maturityRating: String,
    category: String,
    price: Number || String,
    copyright: String
});

module.exports = require('mongoose').model('App', schema);