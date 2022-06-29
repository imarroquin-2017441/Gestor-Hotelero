'use strict'

const mongoose = require('mongoose');

const hotelSchema = mongoose.Schema({
    name: String,
    direction: String,
    email: String,
    phone: String,
    user: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Hotel', hotelSchema);