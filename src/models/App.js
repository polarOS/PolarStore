const schema = new require('mongoose').Schema({
    name: String,
    download: String,
    logo: String,
    version: String,
    description: String,
    rating: Number,
    author: String,
    compatibility: String,
    language: String,
    maturityRating: String,
    category: String
});

module.exports = require('mongoose').model('App', schema);