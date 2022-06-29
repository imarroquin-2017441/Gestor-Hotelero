'use strict'

const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    type: String,
    available: Number,
    price: Number,
    hotel: {type: mongoose.Schema.ObjectId, ref: 'Hotel'}
});

module.exports = mongoose.model('Room', roomSchema);