'use strict'

const express = require('express');
const reserController = require('../controllers/reservation.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/pruebaReservation', reserController.pruebaReservation);

api.post('/addRoomToReservation/:id', mdAuth.ensureAuth, reserController.addRoomsToReservation);

module.exports = api;