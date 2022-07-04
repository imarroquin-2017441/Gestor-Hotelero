'use strict'

const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    dateStart: Date,
    days: Number,
    hotel: {type: mongoose.Schema.ObjectId, ref: 'Hotel'},
    rooms: [{
        room: {type: mongoose.Schema.ObjectId, ref: 'Room'},
        quantity: Number,
        subTotal: Number
    }],
    events: [{
        event: {type: mongoose.Schema.ObjectId, ref: 'Event'},
        subTotal: Number
    }],
    total: Number
});

module.exports = mongoose.model('Reservation', reservationSchema);