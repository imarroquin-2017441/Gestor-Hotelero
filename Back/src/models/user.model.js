'use strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    surname: String,
    username: String,
    email: String,
    phone: String,
    password: String,
    role: String
});

module.exports = mongoose.model('User', userSchema);