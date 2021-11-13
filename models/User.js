const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const userSchema = new Schema({
    username: String,
    discriminator: String,
    avatar: String,
    language: String,
    email: String,
    discordId: String,
    createdAt: String,
    polarStore: Object
});

const db = mongoose.connection.useDb('PolarID');

module.exports = db.model('User', userSchema);